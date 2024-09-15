import chalk from "chalk";
import { promptAuthenticatedUser } from "../../inquirer-commands/ask-authenticated.js";
import { handleAuthenticatedAction } from "../ask-authenticated-action.js";
import { saveSession } from "../../functions/session.js";
import { Session } from "../../types/index.js";
import { createSpinner } from "nanospinner";
import { sleep } from "../../utils/sleep.js";

export async function HeadOutActions(
  action: string,
  session: Session,
  currentUser: string
) {
  switch (action) {
    case "Exit(Session will be saved)":
      console.log(chalk.blueBright("You shall be remembered !!"));
      process.exit(0);
    case "Logout":
      const spinner = createSpinner("Logging out...").start();
      await sleep(1000);
      spinner.success({ text: chalk.green("Logged out successfully.") });
      session.currentUser = null;
      await saveSession(session);
      break;
    case "Back":
      //recursive call
      const newAction = await promptAuthenticatedUser(currentUser);
      await handleAuthenticatedAction(newAction, currentUser, session);
      break;
    default:
      console.log(chalk.red("Invalid action"));
      break;
  }
}
