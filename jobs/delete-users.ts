import { Transaction } from "@Core/common/mod.ts";
import { UserModel } from "@Models/user.ts";
import { AccountModel } from "@Models/account.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { Cron } from "croner";
import { Database } from "@Database";
import { WalletModel } from "@Models/wallet.ts";
import { TransactionModel } from "@Models/transaction.ts";

export const PermanentlyDeleteUsers = Transaction.add(async (_, next) => {
  const Users = await UserModel.find({ deletionAt: { $lt: new Date() } })
    .project({ deletionAt: 0 })
    .catch(() => {
      // Do nothing...
    });

  const Transactions: Array<Transaction> = [];

  if (Users?.length)
    for (const User of Users)
      Transactions.push(
        Transaction.add(async (_, next) => {
          await Database.transaction(async (session) => {
            await UserModel.deleteOne({ _id: User._id }, { session });

            const Accounts = await AccountModel.find(
              { createdFor: User._id },
              { session }
            );

            const AccountIDs = Accounts.map((account) => account._id);

            await AccountModel.deleteMany(
              { _id: { $in: AccountIDs } },
              { session }
            );

            const Collaborations = await CollaboratorModel.find(
              { account: { $in: AccountIDs } },
              { session }
            );

            const CollaboratorIDs = Collaborations.map(
              (collaboration) => collaboration._id
            );

            await CollaboratorModel.deleteMany(
              { _id: { $in: CollaboratorIDs } },
              { session }
            );

            const Wallets = await WalletModel.find(
              { account: { $in: AccountIDs } },
              { session }
            );

            for (const Wallet of Wallets)
              if (Wallet.balance !== 0) throw new Error("Wallet balance is 0!");

            // Just delete Wallet. Transactions cannot be deleted as they are shared.
            await WalletModel.deleteMany(
              { account: { $in: AccountIDs } },
              { session }
            );

            await next({
              user: User,
              collaborations: Collaborations,
              accounts: Accounts,
              wallets: Wallets,
            });
          }).catch(console.error);
        })
      );

  await next({ eachDeletion: Transactions });

  for (const Transaction of Transactions)
    await Transaction.exec().catch(console.error);
});

export default async () => {
  // Delete scheduled users on start
  await PermanentlyDeleteUsers.exec();

  // Delete every day...
  new Cron("0 0 0 * * *").schedule(() => PermanentlyDeleteUsers.exec());
};
