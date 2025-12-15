import chalk from "chalk";
import { login } from "./nested-actions-for-inquirers/login.js";
import { register } from "./nested-actions-for-inquirers/register.js";
import { resetPassword } from "./nested-actions-for-inquirers/reset-pass.js";
import { Session, UserStore } from "../types/index.js";
import { getUsernames } from "../utils/user-transactions.js";

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
    case "Forgot Username":
      const usernames = await getUsernames();
      if (usernames.length > 0) {
        console.log(chalk.cyan("\nRegistered Usernames:"));
        usernames.forEach(username => {
          console.log(chalk.green(`- ${username}`));
        });
        console.log(""); // Empty line for spacing
      } else {
        console.log(chalk.yellow("\nNo users found.\n"));
      }
      return null;
    case "Exit":
    default:
      console.log(chalk.yellow("Goodbye!"));
      process.exit();
  }
}
