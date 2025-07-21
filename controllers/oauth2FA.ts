// deno-lint-ignore-file no-explicit-any
import {
  BaseController,
  Controller,
  Env,
  Get,
  type IRequestContext,
  type IRoute,
  Post,
  Response,
  Versioned,
} from "@Core/common/mod.ts";
import { responseValidator } from "@Core/common/validators.ts";
import { type RouterContext, Status } from "oak";
import e from "validator";

import { TOTP } from "totp";
import OauthController, { DefaultOauthIssuer } from "./oauth.ts";
import { OauthTotpModel, TotpStatus } from "@Models/oauthTOTP.ts";
import { ObjectId } from "mongo";

export enum OTPTokenType {
  CHALLENGE = "challenge",
  VERIFIED = "verified",
}

@Controller("/oauth/2fa/", { group: "Oauth", name: "oauth2FA" })
export default class Oauth2FAController extends BaseController {
  static base32Encode(input: string) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let output = "";
    let buffer = 0;
    let bitsLeft = 0;

    for (let i = 0; i < input.length; i++) {
      buffer = (buffer << 8) | input.charCodeAt(i);
      bitsLeft += 8;

      while (bitsLeft >= 5) {
        output += alphabet[(buffer >> (bitsLeft - 5)) & 31];
        bitsLeft -= 5;
      }
    }

    if (bitsLeft > 0) {
      output += alphabet[(buffer << (5 - bitsLeft)) & 31];
    }

    while (output.length % 8 !== 0) {
      output += "=";
    }

    return output;
  }

  static async sign(
    type: OTPTokenType,
    payload: Record<string, any> = {},
  ) {
    return {
      token: (
        await OauthController.createToken({
          type: `otp_${type}`,
          payload,
          expiresInSeconds: 60 * 60, // Expires in 1 hour.
        })
      ).token,
    };
  }

  static verify<T extends object>(
    type: OTPTokenType,
    token: string,
  ) {
    return OauthController.verifyToken<T>({
      type: `otp_${type}`,
      token,
    });
  }

  @Post("/totp/")
  public createTOTP(_: IRoute) {
    return new Versioned().add("1.0.0", {
      shape: () => ({
        return: responseValidator(e.object({
          _id: e.instanceOf(ObjectId, { instantiate: true }),
          uri: e.string(),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        if (
          await OauthTotpModel.exists({
            createdBy: new ObjectId(ctx.router.state.auth.userId),
            status: TotpStatus.ACTIVE,
          })
        ) throw e.error("Authenticator already setup!");

        const payload = {
          issuer: `${DefaultOauthIssuer} (${Env.getType()})`,
          label: ctx.router.state.auth.user.username,
          secret: Oauth2FAController.base32Encode(crypto.randomUUID()),
        };

        const totp = new TOTP(payload);

        const { _id } = await OauthTotpModel.create({
          createdBy: ctx.router.state.auth.userId,
          payload,
        });

        return Response.statusCode(Status.Created).data({
          _id,
          uri: totp.toString(),
        });
      },
    });
  }

  @Post("/totp/activate/")
  public activateTOTP(route: IRoute) {
    // Define Params Schema
    const BodySchema = e.object({
      id: e.instanceOf(ObjectId, { instantiate: true }),
      code: e.string().notIsNaN().min(6).max(6),
    });

    return new Versioned().add("1.0.0", {
      shape: () => ({
        body: BodySchema.toSample(),
        return: responseValidator().toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        const query = {
          _id: Body.id,
          createdBy: new ObjectId(ctx.router.state.auth.userId),
          status: TotpStatus.PENDING,
        };

        const totpData = await OauthTotpModel.findOne(query).project({
          payload: 1,
        });

        if (!totpData) throw new Error("No authenticator was initiated!");

        const totp = new TOTP(totpData.payload);

        const delta = totp.validate({ token: Body.code, window: 1 });

        if (delta === null) throw new Error("Invalid OTP code provided!");

        await OauthTotpModel.updateOneOrFail(query, {
          status: TotpStatus.ACTIVE,
        });

        return Response.data({ delta });
      },
    });
  }

  @Get("/totp/")
  public getTOTP(_: IRoute) {
    return new Versioned().add("1.0.0", {
      shape: () => ({
        return: responseValidator(
          e.omit(OauthTotpModel.getSchema(), ["payload"]),
        ).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        if (!ctx.router.state.auth) ctx.router.throw(Status.Unauthorized);

        return Response.data(
          await OauthTotpModel.findOneOrFail({
            createdBy: new ObjectId(ctx.router.state.auth.userId),
            status: TotpStatus.ACTIVE,
          }).project({ payload: 0 }),
        );
      },
    });
  }

  @Post("/totp/authorize/")
  public authorizeTOTP(route: IRoute) {
    // Define Body Schema
    const BodySchema = e.object({
      challengeToken: e.string(),
      code: e.string().min(6).max(6),
    });

    return new Versioned().add("1.0.0", {
      shape: () => ({
        body: BodySchema.toSample(),
        return: responseValidator(e.object({
          token: e.string(),
        })).toSample(),
      }),
      handler: async (ctx: IRequestContext<RouterContext<string>>) => {
        // Body Validation
        const Body = await BodySchema.validate(
          await ctx.router.request.body.json(),
          { name: `${route.scope}.body` },
        );

        const { userId } = await Oauth2FAController.verify<{ userId: string }>(
          OTPTokenType.CHALLENGE,
          Body.challengeToken,
        );

        const createdBy = new ObjectId(userId);

        const totpData = await OauthTotpModel.findOne({
          createdBy,
          status: TotpStatus.ACTIVE,
        }).project({
          payload: 1,
        });

        if (!totpData) {
          throw e.error("No authenticator found or has been setup!");
        }

        const totp = new TOTP(totpData.payload);

        const delta = totp.validate({ token: Body.code, window: 1 });

        if (delta === null) throw e.error("Invalid OTP code provided!");

        return Response.data(
          await Oauth2FAController.sign(
            OTPTokenType.VERIFIED,
            {
              userId: createdBy.toString(),
            },
          ),
        );
      },
    });
  }
}
