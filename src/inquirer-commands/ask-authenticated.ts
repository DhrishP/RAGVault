import chalk from "chalk";
import inquirer from "inquirer";

export async function promptAuthenticatedUser(currentUser: string) {
  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: "list",
      name: "action",
      message: chalk.cyan(
        `Welcome back, ${currentUser}! What would you like to do?`
      ),
      choices: [
        "Ask a question🤔",
        "Add data to your local brain🧠",
        "Clear CLI🧹",
        "History🔍",
        "Settings",
        "Export Data",
        "Import Data",
        "Head Out👋",
      ],
    },
  ]);
  return action;
}
