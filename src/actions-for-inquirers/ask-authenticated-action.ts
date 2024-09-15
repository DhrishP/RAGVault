import chalk from "chalk";
import inquirer from "inquirer";
import { HeadOutCommands } from "../inquirer-commands/nested-commands/headout.js";
import { HeadOutActions } from "./nested-actions-for-inquirers/headout-actions.js";
import { SettingsCommands } from "../inquirer-commands/nested-commands/settings.js";
import { SettingsActions } from "./nested-actions-for-inquirers/settings-actions.js";
import { checkChromaDocker } from "../utils/check-chromadocker.js";
import { promptAuthenticatedUser } from "../inquirer-commands/ask-authenticated.js";
import { LocalBrainActions } from "./nested-actions-for-inquirers/localbrain-actions.js";
import { LocalBrainCommands } from "../inquirer-commands/nested-commands/localbrain.js";

export async function handleAuthenticatedAction(
  action: string,
  currentUser: string,
  session: any
) {
  switch (action) {
    case "Ask a question🤔":
      const res = await inquirer.prompt([
        {
          type: "input",
          name: "question",
          message: "What's your question?",
        },
      ]);
      console.log(chalk.yellow(`You asked: ${res.question}`));
      console.log(
        chalk.gray(
          "I'm an AI assistant, so I can't actually answer that question. But it's a great one!"
        )
      );
      break;
    case "Add data to your local brain🧠":
      const isChromaDockerRunning = await checkChromaDocker();
      if (isChromaDockerRunning) {
        const action = await LocalBrainCommands();
        await LocalBrainActions(action);
      } else {
        console.log(
          chalk.red(
            "ChromaDB Docker is not running. Please start ChromaDB Docker and try again."
          )
        );
        const AskAgainAction = await promptAuthenticatedUser(currentUser);
        await handleAuthenticatedAction(AskAgainAction, currentUser, session);
      }
    case "Clear CLI🧹":
      console.clear();
      break;
    case "Settings":
      const settingsAction = await SettingsCommands();
      await SettingsActions(settingsAction, session, currentUser);
      break;
    case "Head Out👋":
      const headOutAction = await HeadOutCommands();
      await HeadOutActions(headOutAction, session, currentUser);
  }
}
