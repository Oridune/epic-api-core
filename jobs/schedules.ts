import { Application } from "oak";
import Queue from "npm:bull";

export default async (app: Application) => {
  const UserDeletionQueue = new Queue("user-deletion", {});
};
