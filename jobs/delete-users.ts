import mongoose from "mongoose";
import { Transaction } from "@Core/common/mod.ts";
import { UserModel } from "@Models/user.ts";
import { AccountModel } from "@Models/account.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { daily } from "cron";

export const PermanentlyDeleteUsers = Transaction.add(async (_, next) => {
  const Users = await UserModel.find(
    { deletionAt: { $lt: new Date() } },
    { deletionAt: 0 }
  ).catch(() => {
    // Do nothing...
  });

  const Transactions: Array<Transaction> = [];

  if (Users?.length)
    for (const User of Users)
      Transactions.push(
        Transaction.add(async (_, next) => {
          const Session = await mongoose.startSession();

          try {
            Session.startTransaction();

            await UserModel.deleteOne({ _id: User._id }).session(Session);

            const Accounts = await AccountModel.find({
              createdFor: User._id,
            }).session(Session);

            const AccountIDs = Accounts.map((account) => account._id);

            await AccountModel.deleteMany({
              _id: { $in: AccountIDs },
            }).session(Session);

            const Collaborations = await CollaboratorModel.find({
              account: { $in: AccountIDs },
            }).session(Session);

            const CollaboratorIDs = Collaborations.map(
              (collaboration) => collaboration._id
            );

            await CollaboratorModel.deleteMany({
              _id: { $in: CollaboratorIDs },
            }).session(Session);

            await next({
              user: User,
              collaborations: Collaborations,
              accounts: Accounts,
            });

            await Session.commitTransaction();
          } catch (error) {
            await Session.abortTransaction();
            console.error(error);
          } finally {
            await Session.endSession();
          }
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
  daily(() => PermanentlyDeleteUsers.exec());
};
