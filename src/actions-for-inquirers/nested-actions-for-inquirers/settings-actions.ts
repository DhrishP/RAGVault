import chalk from "chalk";
import { promptAuthenticatedUser } from "../../inquirer-commands/ask-authenticated.js";
import { handleAuthenticatedAction } from "../ask-authenticated-action.js";
import {
  Session,
  User,
  embeddingLLM,
  UserStore,
  LLM,
} from "../../types/index.js";
import inquirer from "inquirer";
import { sleep } from "../../utils/sleep.js";
import { SettingsCommands } from "../../inquirer-commands/nested-commands/settings.js";
import { createSpinner } from "nanospinner";
import { saveUsers } from "../../utils/user-transactions.js";
import { ChooseLLMCommands } from "../../inquirer-commands/nested-commands/nested-nested-commands/chooseLLM.js";
import { saveSession } from "../../utils/session.js";
import { ChooseEmbeddingModel } from "../../inquirer-commands/nested-commands/nested-nested-commands/choose-embedding-model.js";

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
          message: "Choose an AI provider to add/update a key for:",
          choices: [
            {
              name: `OpenAI ${
                users[currentUser].openAIKey ? "(Key Set ✓)" : ""
              }`,
              value: "openAI",
            },
            {
              name: `Claude ${
                users[currentUser].claudeKey ? "(Key Set ✓)" : ""
              }`,
              value: "claude",
            },
            {
              name: `Gemini ${
                users[currentUser].geminiKey ? "(Key Set ✓)" : ""
              }`,
              value: "gemini",
            },
            "back",
          ],
        },
      ]);

      if (aiProvider !== "back") {
        const keyMapping: Record<string, keyof User> = {
          openAI: "openAIKey",
          claude: "claudeKey",
          gemini: "geminiKey",
        };

        const currentKey = users[currentUser][keyMapping[aiProvider]];
        if (currentKey) {
          console.log(
            chalk.yellow(
              `Current ${aiProvider} key is set. Enter new key to update or 'skip' to keep current.`
            )
          );
        }

        const { apiKey } = await inquirer.prompt([
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
      break;

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
      break;

    case "Choose Remote LLM":
      const llmAction = await ChooseLLMCommands();
      switch (llmAction) {
        case "openAI":
          session.answerLLM = LLM.OPENAI;
          if (!users[currentUser].openAIKey) {
            console.log(
              chalk.yellow(
                "\nNote: OpenAI API key is not set. You can set it in 'Add AI Providers Keys'"
              )
            );
          }
          break;
        case "claude":
          session.answerLLM = LLM.CLAUDE;
          if (!users[currentUser].claudeKey) {
            console.log(
              chalk.yellow(
                "\nNote: Claude API key is not set. You can set it in 'Add AI Providers Keys'"
              )
            );
          }
          break;
        case "gemini":
          session.answerLLM = LLM.GEMINI;
          if (!users[currentUser].geminiKey) {
            console.log(
              chalk.yellow(
                "\nNote: Gemini API key is not set. You can set it in 'Add AI Providers Keys'"
              )
            );
          }
          break;
        case "Back":
          const newActionBack = await SettingsCommands();
          await SettingsActions(newActionBack, session, currentUser, users);
          return;
      }

      await saveSession(session);
      const spinner = createSpinner("Updating LLM preference...").start();
      await sleep(1000);
      spinner.success({
        text: chalk.green("LLM preference updated successfully!"),
      });

      const newAction = await SettingsCommands();
      await SettingsActions(newAction, session, currentUser, users);
      break;

    case "Choose Embedding Model":
      const embeddingAction = await ChooseEmbeddingModel();
      switch (embeddingAction) {
        case "OpenAI":
          session.embeddingLLM = embeddingLLM.OPENAI;
          if (!users[currentUser].openAIKey) {
            console.log(
              chalk.yellow(
                "\nNote: OpenAI API key is not set. You can set it in 'Add AI Providers Keys'"
              )
            );
          }
          const { modelName } = await inquirer.prompt([
            {
              type: "input",
              name: "modelName",
              message: "Enter the OpenAI embedding model name:",
              default: "text-embedding-3-small",
            },
          ]);
          users[currentUser].embeddingModelName = modelName;
          await saveUsers(users);
          break;
        case "Back":
          const newActionBack = await SettingsCommands();
          await SettingsActions(newActionBack, session, currentUser, users);
          return;
      }
      await saveSession(session);
      const spinnerEmbedding = createSpinner("Updating Embedding Model...").start();
      await sleep(1000);
      spinnerEmbedding.success({
        text: chalk.green("Embedding Model updated successfully!"),
      });
      const newActionEmbedding = await SettingsCommands();
      await SettingsActions(newActionEmbedding, session, currentUser, users);
      break;

    case "Back":
      const newActionBack = await promptAuthenticatedUser(currentUser);
      await handleAuthenticatedAction(
        newActionBack,
        currentUser,
        session,
        users
      );
      break;
  }
}
