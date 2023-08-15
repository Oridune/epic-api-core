import mongoose from "mongoose";
import { Events } from "@Core/common/events.ts";
import { UserModel } from "@Models/user.ts";
import { AccountModel } from "@Models/account.ts";
import { CollaboratorModel } from "@Models/collaborator.ts";
import { daily } from "cron";

export const permanentlyDeleteUsers = async () => {
  const Session = await mongoose.startSession();

  try {
    const Users = await UserModel.find(
      { deletionAt: { $lt: new Date() } },
      { deletionAt: 0 }
    ).catch(() => {
      // Do nothing...
    });

    if (Users?.length) {
      Session.startTransaction();

      const UserIDs = Users.map((user) => user._id);

      await UserModel.deleteMany({
        _id: { $in: UserIDs },
      }).session(Session);

      const Accounts = await AccountModel.find({
        createdFor: { $in: UserIDs },
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

      Events.dispatch("user-deleted", {
        detail: {
          users: Users,
          collaborations: Collaborations,
          accounts: Accounts,
        },
      });

      await Session.commitTransaction();
    }
  } catch (error) {
    console.error(error);
    await Session.abortTransaction();
  } finally {
    await Session.endSession();
  }
};

export default async () => {
  // Delete scheduled users on start
  await permanentlyDeleteUsers();

  // Delete every day...
  daily(permanentlyDeleteUsers);
};
