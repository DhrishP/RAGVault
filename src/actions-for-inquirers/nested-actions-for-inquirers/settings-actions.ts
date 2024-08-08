import chalk from "chalk";
import { promptAuthenticatedUser } from "../../inquirer-commands/ask-authenticated.js";
import { handleAuthenticatedAction } from "../ask-authenticated-action.js";
import { Session, User } from "../../types/index.js";
import inquirer from "inquirer";
import { sleep } from "../../utils/sleep.js";
import { SettingsCommands } from "../../inquirer-commands/nested-commands/settings.js";
import { createSpinner } from "nanospinner";
import { UserStore } from "../../types/index.js";
import { saveUsers } from "../../utils/user-transactions.js";

export async function SettingsActions(
  action: string,
  session: Session,
  currentUser: string,
  users: UserStore
) {
  switch (action) {
    case "Add AI Providers Keys":
      const { aiProvider } = await inquirer.prompt([
        {
          type: "list",
          name: "aiProvider",
          message: "Choose an AI provider to add a key for:",
          choices: ["openAI", "claude", "fireworks", "back"],
        },
      ]);

      if (aiProvider !== "back") {
        const { apiKey }: { apiKey: string } = await inquirer.prompt([
          {
            type: "input",
            name: "apiKey",
            message: `Enter your ${aiProvider} API key (Type 'skip' to skip):`,
            validate: (input: string) =>
              input.trim() !== "" || `${aiProvider} API key cannot be empty`,
          },
        ]);

        if (apiKey !== "skip") {
          (users[currentUser] as User)[(aiProvider + "Key") as keyof User] =
            apiKey; // This line is used to add the API key to the user object , Sorry if it's a bit confusing
          await saveUsers(users);
          const spinner = createSpinner(
            `Saving ${aiProvider} API key...`
          ).start();
          await sleep(1000);
          spinner.success({
            text: chalk.green(`${aiProvider} API key saved successfully!`),
          });
          const newAction = await SettingsCommands();
          await SettingsActions(newAction, session, currentUser, users);
        }
        const newActionProvider = await SettingsCommands();
        await SettingsActions(newActionProvider, session, currentUser, users);
      }

      // Recursive call to allow adding multiple keys
      const newActionProvider = await SettingsCommands();
      await SettingsActions(newActionProvider, session, currentUser, users);

    case "Set Notion Configurations":
      const { notionToken } = await inquirer.prompt([
        {
          type: "input",
          name: "notionToken",
          message: "Enter your Notion API token:",
          validate: (input: string) =>
            input.trim() !== "" || "Notion API token cannot be empty",
        },
      ]);

      users[currentUser].notionToken = notionToken;
      await saveUsers(users);
      console.log(
        chalk.green("Notion API token saved successfully! Going Back a step...")
      );
      sleep(2000);
      const newNotionAction = await SettingsCommands();
      //recursive call
      await SettingsActions(newNotionAction, session, currentUser, users);

    case "Choose Remote LLM":
     
    case "Back":
      //recursive call
      const newAction = await promptAuthenticatedUser(currentUser);
      await handleAuthenticatedAction(newAction, currentUser, session, users);
      break;
  }
}
