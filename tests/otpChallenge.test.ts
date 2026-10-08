import "../index.d.ts";

import { expect } from "expect";

// There is no .env in the repo, so give the module graph the few variables it
// reads at import time.
for (
  const [Key, Value] of Object.entries({
    ENV_TYPE: "test",
    DISPLAY_NAME: "Test",
    ENCRYPTION_KEY: "test-encryption-key",
    STORE_TYPE: "map",
    // A scratch database of its own, this suite drops it.
    DATABASE_CONNECTION_STRING:
      "mongodb://localhost:27017/epic-api-core-otp-test",
  })
) if (!Deno.env.get(Key)) Deno.env.set(Key, Value);

// Models load before controllers in the app, and the oauth app model reads an
// enum back out of this controller. Keep that order here too.
await import("@Models/oauthApp.ts");

const {
  default: UsersIdentificationController,
  IdentificationPurpose,
  IdentificationMethod,
} = await import("@Controllers/usersIdentification.ts");

const { RECOVERY } = IdentificationPurpose;

const sign = (userId: string) =>
  UsersIdentificationController.sign(RECOVERY, null, { userId });

const verify = (token: string, code: number) =>
  UsersIdentificationController.verify<{ userId: string }>(
    token,
    code,
    RECOVERY,
    null,
  );

Deno.test({
  name: "OTP challenge",
  async fn(t) {
    await t.step("a correct code works, but only once", async () => {
      const { token, otp } = await sign("user-1");

      expect((await verify(token, otp)).userId).toBe("user-1");

      await expect(verify(token, otp)).rejects.toThrow();
    });

    await t.step("5 wrong codes burn the challenge", async () => {
      const { token, otp } = await sign("user-2");
      const Wrong = otp === 100000 ? 100001 : 100000;

      for (let i = 0; i < UsersIdentificationController.MaxWrongAttempts; i++) {
        await expect(verify(token, Wrong)).rejects.toThrow();
      }

      // The right code is no good either now, a new one has to be requested.
      await expect(verify(token, otp)).rejects.toThrow();
    });

    await t.step("asking for a new code cancels the previous one", async () => {
      const First = await sign("user-3");
      const Second = await sign("user-3");

      await expect(verify(First.token, First.otp)).rejects.toThrow();
      expect((await verify(Second.token, Second.otp)).userId).toBe("user-3");
    });
  },
});

const { default: verifyHuman } = await import("@Middlewares/verifyHuman.ts");

/**
 * These paths reject with the framework's own types (a validation exception, a
 * `Response`), not with an `Error`, so assert on the rejection itself.
 */
const rejection = (promise: Promise<unknown>) =>
  promise.then(
    () => null,
    // deno-lint-ignore no-explicit-any
    (error): any => error ?? new Error("rejected"),
  );

Deno.test({
  name: "verifyHuman cannot be skipped by omitting the app id",
  async fn(t) {
    const ctx = () =>
      ({
        request: {
          url: new URL("http://localhost/test"),
          hasBody: false,
          body: { json: () => Promise.resolve({}) },
        },
        params: {},
        // deno-lint-ignore no-explicit-any
      }) as any;

    await t.step("a required app id that is missing is rejected", async () => {
      let Called = false;

      const Error_ = await rejection(
        verifyHuman({ required: true })(ctx(), () => {
          Called = true;
          return Promise.resolve();
        }),
      );

      expect(Error_).not.toBe(null);
      expect(Called).toBe(false);
    });

    await t.step("without `required` the request still passes", async () => {
      let Called = false;

      await verifyHuman()(ctx(), () => {
        Called = true;
        return Promise.resolve();
      });

      expect(Called).toBe(true);
    });
  },
});

const { rateLimiter } = await import("@Core/middlewares/rateLimiter.ts");

Deno.test({
  name: "the rate limiter ignores a client supplied x-forwarded-for",
  async fn() {
    // One proxy of ours sits in front, so it appends the real client IP last.
    // Everything before that is whatever the client decided to send.
    const call = (spoofed: string) =>
      rateLimiter({ limit: 3, windowMs: 60000 })(
        {
          request: {
            headers: new Headers({
              "x-forwarded-for": `${spoofed}, 203.0.113.9`,
            }),
            ip: "127.0.0.1",
          },
          response: { headers: new Headers(), status: 200 },
          throw: (_status: number, message: string) => {
            throw new Error(message);
          },
          // deno-lint-ignore no-explicit-any
        } as any,
        () => Promise.resolve(),
      );

    await call("1.1.1.1");
    await call("2.2.2.2");

    // A fresh spoofed IP every time, yet the same counter still catches up.
    await expect(call("3.3.3.3")).rejects.toThrow(
      "You've reached your request limits!",
    );
  },
});

const { Database } = await import("@Database");
const { UserModel } = await import("@Models/user.ts");
const { ObjectId } = await import("mongo");
const { Store } = await import("@Core/common/mod.ts");

Deno.test({
  name: "OTP sends are throttled per user",
  // The mongo driver keeps its own pool, which the sanitizers see as a leak.
  sanitizeOps: false,
  sanitizeResources: false,
  async fn(t) {
    await Database.connect();
    await Database.connection.drop();

    const Username = "throttled";

    await UserModel.create({
      username: Username,
      password: "secret123",
      passwordHistory: ["secret123"],
      fname: "Throttle",
      phone: "+218910000000",
      oauthApp: new ObjectId(),
      role: "user",
      collaborates: [new ObjectId()],
    });

    const request = () =>
      UsersIdentificationController.request(
        RECOVERY,
        IdentificationMethod.PHONE,
        { username: Username },
      );

    const user = await UserModel.findOne({ username: Username }).project({
      _id: 1,
    });

    // The cooldown is what the user waits out between two codes. Clearing it
    // is the same as waiting 60s, and lets the hourly cap be reached here.
    const skipCooldown = () =>
      Store.del(`otpCooldown:${RECOVERY}:${user!._id}`);

    await t.step("a second code straight away is refused", async () => {
      await request();

      const Refusal = await rejection(request());

      expect(Refusal?.getStatusCode?.()).toBe(429);
    });

    await t.step("and no more than 5 in an hour", async () => {
      // One was already sent above, so four more reach the cap.
      for (let i = 0; i < 4; i++) {
        await skipCooldown();
        await request();
      }

      await skipCooldown();

      const Refusal = await rejection(request());

      expect(Refusal?.getStatusCode?.()).toBe(429);
    });

    await Database.connection.drop();
    await Database.disconnect();
  },
});
