import chalk from "chalk";
import inquirer from "inquirer";
import { UserStore } from "../types/index.js";

export async function promptCredentials(currentUser: string, users: UserStore) {
  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: "list",
      name: "action",
      message: chalk.cyan(
        `Hello there, ${currentUser}! Please add your credentials for fully enjoying our product. The optional credentials can be added later in settings.`
      ),
      choices: [
        "Set Collection Name*",
        "Add OPENAI-KEY(optional)",
        "Add Notion Credentials(optional)",
      ],
    },
  ]);
  return action;
}
