// deno-lint-ignore-file no-explicit-any
import { Loader } from "@Core/common/mod.ts";
import { createAppServer } from "@Core/server.ts";
import { expect } from "expect";
import { Database } from "@Database";
import e, { inferOutput, ObjectValidator } from "validator";

import { OauthAppSchema } from "@Models/oauthApp.ts";

const TestUsers = [
  [
    {
      fname: "John",
      mname: "A",
      lname: "Doe",
      username: "john",
      password: "John123!",
      gender: "male",
      dob: 1690816285,
      locale: "en-US",
      tags: ["customer"],
      email: "john@gmail.com",
      phone: "+923017933071",
    },
    {
      password: "Johnson123!",
    },
  ],
];

const ResponseWrapperSchema = (dataValidator: ObjectValidator<any, any, any>) =>
  e.object(
    {
      status: e.boolean(),
      messages: e.optional(e.array(e.object({ message: e.string() }))),
      data: dataValidator,
      metrics: e.record(e.any()),
    },
    { cast: true },
  );

const DefaultOauthAppResponseSchema = ResponseWrapperSchema(OauthAppSchema());

const UserResponseSchema = ResponseWrapperSchema(
  e.object({
    _id: e.string(),
    reference: e.string(),
    fname: e.string(),
    mname: e.string(),
    lname: e.string(),
    username: e.string(),
    role: e.string(),
    gender: e.string(),
    dob: e.string(),
    locale: e.string(),
    tags: e.array(e.string()),
    email: e.string(),
    isEmailVerified: e.boolean(),
    phone: e.string(),
    isPhoneVerified: e.boolean(),
    loginCount: e.number(),
    failedLoginAttempts: e.number(),
    requiresMfa: e.boolean(),
    isBlocked: e.boolean(),
    createdAt: e.string(),
    updatedAt: e.string(),
  }),
);

const IdentificationResponseSchema = ResponseWrapperSchema(
  e.object({
    token: e.string(),
    otp: e.number(),
  }),
);

const OAuthTokenSchema = e.object({
  issuer: e.string(),
  type: e.string(),
  token: e.string(),
  expiresAtSeconds: e.number(),
});

const AuthenticationResponseSchema = ResponseWrapperSchema(
  e.object({
    authenticationToken: OAuthTokenSchema,
    availableScopes: e.array(
      e.object({
        _id: e.string(),
        role: e.string(),
        isPrimary: e.boolean(),
        isOwned: e.boolean(),
        account: e.object({
          _id: e.string(),
          isBlocked: e.boolean(),
          createdFor: e.string(),
          createdBy: e.string(),
          createdAt: e.string(),
          updatedAt: e.string(),
        }),
        createdFor: e.string(),
        createdBy: e.string(),
        createdAt: e.string(),
        updatedAt: e.string(),
        scopes: e.array(e.string()),
        isBlocked: e.boolean(),
      }),
    ),
  }),
);

const ExchangeAuthenticationResponseSchema = ResponseWrapperSchema(
  e.object({
    oauthCode: OAuthTokenSchema,
  }),
);

const ExchangeCodeResponseSchema = ResponseWrapperSchema(
  e.object({
    access: OAuthTokenSchema,
    refresh: e.optional(OAuthTokenSchema),
  }),
);

Deno.test({
  name: "Oauth Flow Test",
  async fn(t) {
    await Loader.load({ excludeTypes: ["templates"] });

    const { fetch, start, end, restart } = await createAppServer();

    // Database Cleanup
    Database.connection.post("connect", () => Database.connection.drop());

    const { port } = await start();

    const APIHost = `http://localhost:${port}`;

    const Context: {
      defaultOauthApp?: inferOutput<typeof DefaultOauthAppResponseSchema>;
      emailVerification?: inferOutput<typeof IdentificationResponseSchema>[];
      phoneVerification?: inferOutput<typeof IdentificationResponseSchema>[];
      emailRecovery?: inferOutput<typeof IdentificationResponseSchema>[];
      oauthAuthentication?: inferOutput<typeof AuthenticationResponseSchema>[];
      oauthExchangeAuthentication?: inferOutput<
        typeof ExchangeAuthenticationResponseSchema
      >[];
      oauthExchangeCode?: inferOutput<typeof ExchangeCodeResponseSchema>[];
    } = {};

    await t.step(
      "GET /api/oauth/apps/default/ Get Default Oauth App",
      async () => {
        const Response = await fetch(
          new URL("/api/oauth/apps/default/", APIHost),
        );

        expect(Response?.status).toBe(200);

        Context.defaultOauthApp = await DefaultOauthAppResponseSchema.validate(
          await Response?.json(),
        ).catch((e) => {
          console.error(e.issues);
          throw e;
        });
      },
    );

    await t.step("POST /api/users/:appId Register user(s)", async () => {
      expect(Context.defaultOauthApp).toBeTypeOf("object");

      await Promise.all(
        TestUsers.map(async (user) => {
          const Response = await fetch(
            new URL(`/api/users/${Context.defaultOauthApp!.data._id}`, APIHost),
            { method: "POST", body: JSON.stringify(user[0]) },
          );

          expect(Response?.status).toBe(201);

          await UserResponseSchema.validate(await Response?.json()).catch(
            (e) => {
              console.error(e.issues);
              throw e;
            },
          );
        }),
      );
    });

    await t.step("POST /api/users/:appId Duplicate user(s) error", async () => {
      expect(Context.defaultOauthApp).toBeTypeOf("object");

      await Promise.all(
        TestUsers.map(async (user) => {
          const Response = await fetch(
            new URL(`/api/users/${Context.defaultOauthApp!.data._id}`, APIHost),
            { method: "POST", body: JSON.stringify(user[0]) },
          );

          expect(Response?.status).toBe(400);
        }),
      );
    });

    await t.step(
      "GET /api/users/identification/verification/{{username}}/email/ Get email verification token",
      async () => {
        await Promise.all(
          TestUsers.map(async (user) => {
            const Response = await fetch(
              new URL(
                `/api/users/identification/verification/${
                  user[0].username
                }/email/`,
                APIHost,
              ),
            );

            expect(Response?.status).toBe(200);

            (Context.emailVerification ??= []).push(
              await IdentificationResponseSchema.validate(
                await Response?.json(),
              ),
            );
          }),
        );
      },
    );

    await t.step(
      "GET /api/users/identification/verification/{{username}}/phone/ Get phone verification token",
      async () => {
        await Promise.all(
          TestUsers.map(async (user) => {
            const Response = await fetch(
              new URL(
                `/api/users/identification/verification/${
                  user[0].username
                }/phone/`,
                APIHost,
              ),
            );

            expect(Response?.status).toBe(200);

            (Context.phoneVerification ??= []).push(
              await IdentificationResponseSchema.validate(
                await Response?.json(),
              ),
            );
          }),
        );
      },
    );

    await t.step("GET /api/users/verify/ Verify Email", async () => {
      expect(Context.emailVerification).toBeInstanceOf(Array);

      await Promise.all(
        Context.emailVerification!.map(async (value) => {
          const Response = await fetch(new URL("/api/users/verify/", APIHost), {
            method: "POST",
            body: JSON.stringify({
              method: "email",
              token: value.data.token,
              code: value.data.otp + 1,
            }),
          });

          expect(Response?.status).toBe(400);
        }),
      );

      await Promise.all(
        Context.emailVerification!.map(async (value) => {
          const Response = await fetch(new URL("/api/users/verify/", APIHost), {
            method: "POST",
            body: JSON.stringify({
              method: "email",
              token: value.data.token,
              code: value.data.otp,
            }),
          });

          expect(Response?.status).toBe(200);
        }),
      );
    });

    await t.step("GET /api/users/verify/ Verify Phone", async () => {
      expect(Context.phoneVerification).toBeInstanceOf(Array);

      await Promise.all(
        Context.phoneVerification!.map(async (value) => {
          const Response = await fetch(new URL("/api/users/verify/", APIHost), {
            method: "POST",
            body: JSON.stringify({
              method: "phone",
              token: value.data.token,
              code: value.data.otp,
            }),
          });

          expect(Response?.status).toBe(200);
        }),
      );
    });

    // Wait for the verification background job
    await new Promise((_) => setTimeout(_, 3000));

    await t.step(
      "GET /api/users/identification/recovery/{{username}}/email/ Get email recovery token",
      async () => {
        await Promise.all(
          TestUsers.map(async (user) => {
            const Response = await fetch(
              new URL(
                `/api/users/identification/recovery/${user[0].username}/email/`,
                APIHost,
              ),
            );

            expect(Response?.status).toBe(200);

            (Context.emailRecovery ??= []).push(
              await IdentificationResponseSchema.validate(
                await Response?.json(),
              ),
            );
          }),
        );
      },
    );

    await t.step("PUT /api/users/password/ Update Password", async () => {
      expect(Context.emailRecovery).toBeInstanceOf(Array);

      await Promise.all(
        Context.emailRecovery!.map(async (value, index) => {
          const Response = await fetch(
            new URL("/api/users/password/", APIHost),
            {
              method: "PUT",
              body: JSON.stringify({
                method: "email",
                token: value.data.token,
                code: value.data.otp + 1,
                password: TestUsers[index][1].password,
              }),
            },
          );

          expect(Response?.status).toBe(400);
        }),
      );

      await Promise.all(
        Context.emailRecovery!.map(async (value, index) => {
          const Response = await fetch(
            new URL("/api/users/password/", APIHost),
            {
              method: "PUT",
              body: JSON.stringify({
                method: "email",
                token: value.data.token,
                code: value.data.otp,
                password: TestUsers[index][0].password,
              }),
            },
          );

          expect(Response?.status).toBe(400);
        }),
      );

      await Promise.all(
        Context.emailRecovery!.map(async (value, index) => {
          const Response = await fetch(
            new URL("/api/users/password/", APIHost),
            {
              method: "PUT",
              body: JSON.stringify({
                method: "email",
                token: value.data.token,
                code: value.data.otp,
                password: TestUsers[index][1].password,
              }),
            },
          );

          expect(Response?.status).toBe(200);
        }),
      );
    });

    await t.step("POST /api/oauth/local/ Authenticate", async () => {
      await Promise.all(
        TestUsers.map(async (user) => {
          const Response = await fetch(new URL("/api/oauth/local/", APIHost), {
            method: "POST",
            headers: {
              Authorization: "Basic " +
                btoa(`${user[0].username}:${user[0].password}`),
            },
          });

          expect(Response?.status).toBe(400);
        }),
      );

      await Promise.all(
        TestUsers.map(async (user) => {
          const Response = await fetch(new URL("/api/oauth/local/", APIHost), {
            method: "POST",
            headers: {
              Authorization: "Basic " +
                btoa(`${user[0].username}:${user[1].password}`),
            },
            body: JSON.stringify({
              oauthAppId: Context.defaultOauthApp!.data._id,
              callbackURL:
                Context.defaultOauthApp!.data.consent.allowedCallbackURLs[0],
            }),
          });

          expect(Response?.status).toBe(200);

          (Context.oauthAuthentication ??= []).push(
            await AuthenticationResponseSchema.validate(await Response?.json()),
          );
        }),
      ).catch((error) => {
        console.error(error);
        throw error;
      });
    });

    await t.step(
      "POST /api/oauth/exchange/authentication/ Exchange Authenticate",
      async () => {
        expect(Context.oauthAuthentication).toBeInstanceOf(Array);

        const Response = await fetch(
          new URL("/api/oauth/exchange/authentication/", APIHost),
          {
            method: "POST",
            body: JSON.stringify({
              authenticationToken: "",
              scopes: {},
            }),
          },
        );

        expect(Response?.status).toBe(400);

        await Promise.all(
          TestUsers.map(async (_, index) => {
            const Response = await fetch(
              new URL("/api/oauth/exchange/authentication/", APIHost),
              {
                method: "POST",
                body: JSON.stringify({
                  authenticationToken:
                    Context.oauthAuthentication![index].data.authenticationToken
                      .token,
                  scopes: {
                    [
                      Context.oauthAuthentication![index].data
                        .availableScopes[0]
                        .account._id
                    ]: ["*"],
                  },
                }),
              },
            );

            expect(Response?.status).toBe(201);

            (Context.oauthExchangeAuthentication ??= []).push(
              await ExchangeAuthenticationResponseSchema.validate(
                await Response?.json(),
              ),
            );
          }),
        );
      },
    );

    await t.step("POST /api/oauth/exchange/code/ Exchange Code", async () => {
      expect(Context.oauthAuthentication).toBeInstanceOf(Array);

      const Response = await fetch(
        new URL("/api/oauth/exchange/code/", APIHost),
        {
          method: "POST",
          body: JSON.stringify({
            code: "",
          }),
        },
      );

      expect(Response?.status).toBe(400);

      await Promise.all(
        TestUsers.map(async (_, index) => {
          const Response = await fetch(
            new URL("/api/oauth/exchange/code/", APIHost),
            {
              method: "POST",
              body: JSON.stringify({
                code: Context.oauthExchangeAuthentication![index].data.oauthCode
                  .token,
              }),
            },
          );

          expect(Response?.status).toBe(200);

          (Context.oauthExchangeCode ??= []).push(
            await ExchangeCodeResponseSchema.validate(await Response?.json()),
          );
        }),
      );
    });

    await t.step("PATCH /api/admin/core Update System Core", async () => {
      expect(Context.oauthExchangeCode).toBeInstanceOf(Array);

      await Promise.all(
        TestUsers.map(async (_, index) => {
          const Response = await fetch(new URL("/api/admin/core", APIHost), {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${
                Context.oauthExchangeCode![index].data.access.token
              }`,
            },
          });

          expect(Response?.status).toBe(401);
        }),
      );
    });

    await t.step("DELETE /api/users/ Delete User(s)", async () => {
      expect(Context.oauthExchangeCode).toBeInstanceOf(Array);

      await Promise.all(
        TestUsers.map(async (_, index) => {
          const Response = await fetch(
            new URL("/api/users/?deletionTimeoutMs=1000", APIHost),
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${
                  Context.oauthExchangeCode![index].data.access.token
                }`,
              },
            },
          );

          expect(Response?.status).toBe(200);
        }),
      );
    });

    await new Promise((_) => setTimeout(_, 3000));

    await restart();

    await t.step("POST /api/oauth/local/ Authenticate", async () => {
      await Promise.all(
        TestUsers.map(async (user) => {
          const Response = await fetch(new URL("/api/oauth/local/", APIHost), {
            method: "POST",
            headers: {
              Authorization: "Basic " +
                btoa(`${user[0].username}:${user[1].password}`),
            },
            body: JSON.stringify({
              oauthAppId: Context.defaultOauthApp!.data._id,
              callbackURL:
                Context.defaultOauthApp!.data.consent.allowedCallbackURLs[0],
            }),
          });

          expect(Response?.status).toBe(400);
        }),
      );
    });

    await end();
  },
  sanitizeResources: false,
  sanitizeOps: false,
  sanitizeExit: false,
});
