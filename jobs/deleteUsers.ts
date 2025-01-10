import { TransactionQueue } from "@Core/common/mod.ts";
import { ClientSession, ObjectId } from "mongo";
import { Database } from "@Database";

import { UserModel } from "@Models/user.ts";
import { AccountModel } from "@Models/account.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { AccountInviteModel } from "@Models/accountInvite.ts";
import { WalletModel } from "@Models/wallet.ts";

export const PermanentlyDeleteUser = TransactionQueue.add<{
  userId: ObjectId;
  databaseSession?: ClientSession;
}>(async (ctx, next) => {
  await Database.transaction(async (session) => {
    await UserModel.deleteOneOrFail({ _id: ctx.input.userId }, { session });

    const Accounts = await AccountModel.find(
      { createdFor: ctx.input.userId },
      { session },
    ).project({ _id: 1 });

    for (const Account of Accounts) {
      await PermanentlyDeleteAccount.exec({
        userId: ctx.input.userId,
        accountId: Account._id,
        databaseSession: ctx.input.databaseSession,
      });
    }

    await next();
  }, ctx.input.databaseSession);
});

export const PermanentlyDeleteAccount = TransactionQueue.add<{
  userId: ObjectId;
  accountId: ObjectId;
  databaseSession?: ClientSession;
}>(async (ctx, next) => {
  await Database.transaction(async (session) => {
    await AccountModel.deleteOneOrFail(
      { _id: ctx.input.accountId, createdFor: ctx.input.userId },
      { session },
    );

    await CollaboratorModel.deleteMany(
      { account: ctx.input.accountId },
      { session },
    );

    await AccountInviteModel.deleteMany(
      { account: ctx.input.accountId },
      { session },
    );

    const Wallets = await WalletModel.find(
      { account: ctx.input.accountId },
      { session },
    ).project({ balance: 1 });

    for (const Wallet of Wallets) {
      if (Wallet.balance !== 0) throw new Error("Wallet balance is not 0!");
    }

    // Just delete Wallet. Transactions cannot be deleted as they are shared.
    await WalletModel.deleteMany({ account: ctx.input.accountId }, { session });

    await next();
  }, ctx.input.databaseSession);
});

export const deleteScheduledUsers = async () => {
  const Users = await UserModel.find({ deletionAt: { $lt: new Date() } })
    .project({ _id: 1 })
    .catch(console.error);

  if (Users?.length) {
    for (const User of Users) {
      await PermanentlyDeleteUser.exec({ userId: User._id }).catch(
        console.error,
      );
    }
  }
};

export default async () => {
  // Delete scheduled users on start
  await deleteScheduledUsers();

  // TODO: Schedule user deletion using cron!
};
