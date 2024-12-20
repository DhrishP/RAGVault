import chalk from "chalk";
import { login } from "./nested-actions-for-inquirers/login.js";
import { register } from "./nested-actions-for-inquirers/register.js";
import { resetPassword } from "./nested-actions-for-inquirers/reset-pass.js";
import { Session, UserStore } from "../types/index.js";

export async function handleUnauthenticatedAction(
  action: string,
  users: UserStore,
  session: Session
) {
  switch (action) {
    case "Login":
      return await login(users);
    case "Register":
      return await register(users, session);
    case "Reset Password":
      await resetPassword(users);
      return null;
    case "Exit":
    default:
      console.log(chalk.yellow("Goodbye!"));
      process.exit();
  }
}
