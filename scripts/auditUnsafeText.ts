/**
 * Find users and accounts whose free text holds markup, and optionally block
 * them for review.
 *
 * Reports only, unless --block is passed. Nothing is ever rewritten: a name is
 * evidence until somebody has looked at it.
 *
 *   deno run -A scripts/auditUnsafeText.ts
 *   deno run -A scripts/auditUnsafeText.ts --block
 *   deno run -A scripts/auditUnsafeText.ts --block --id 6a2708d0fb19e15b1fc47110
 */
import { parseArgs } from "flags/parse-args";
import { ObjectId } from "mongo";
import { Database } from "@Database";
import { UserModel } from "@Models/user.ts";
import { AccountModel } from "@Models/account.ts";

const Args = parseArgs(Deno.args);
const Block = !!Args.block;
const OnlyId: string | undefined = Args.id;

/** `<`, `>`, `"` or a scheme that executes. */
const Unsafe = { $regex: /[<>"]|javascript:/i };

const UserFields = [
  "fname",
  "mname",
  "lname",
  "address_1",
  "address_2",
  "city",
  "state",
  "country",
  "postalCode",
  "tags",
];

const AccountFields = ["name", "description"];

const show = (
  label: string,
  doc: Record<string, unknown>,
  fields: string[],
) => {
  const Hits = fields
    .filter((f) =>
      typeof doc[f] === "string" && /[<>"]|javascript:/i.test(doc[f] as string)
    )
    .map((f) => `${f}=${JSON.stringify(doc[f])}`);

  console.log(`  ${label} ${doc._id}  ${Hits.join("  ")}`);
};

await Database.connect();

const UserFilter = OnlyId
  ? { _id: new ObjectId(OnlyId) }
  : { $or: UserFields.map((f) => ({ [f]: Unsafe })) };

const Users = await UserModel.find(UserFilter).project({
  username: 1,
  phone: 1,
  isBlocked: 1,
  ...Object.fromEntries(UserFields.map((f) => [f, 1])),
});

console.log(`\nusers with markup in free text: ${Users.length}`);
for (const User of Users) show(User.username ?? "", User, UserFields);

const Accounts = OnlyId ? [] : await AccountModel.find({
  $or: AccountFields.map((f) => ({ [f]: Unsafe })),
}).project({ name: 1, description: 1, isBlocked: 1 });

console.log(`\naccounts with markup in free text: ${Accounts.length}`);
for (const Account of Accounts) show("", Account, AccountFields);

if (Block) {
  for (const User of Users) {
    await UserModel.updateOne(User._id, { isBlocked: true });
    console.log(`blocked user ${User._id}`);
  }

  for (const Account of Accounts) {
    await AccountModel.updateOne(Account._id, { isBlocked: true });
    console.log(`blocked account ${Account._id}`);
  }
} else if (Users.length || Accounts.length) {
  console.log("\nnothing changed. re-run with --block to block these.");
}

await Database.disconnect();
