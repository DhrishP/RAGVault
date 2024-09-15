import chalk from "chalk";
import { promptAuthenticatedUser } from "../../inquirer-commands/ask-authenticated.js";
import { handleAuthenticatedAction } from "../ask-authenticated-action.js";
import inquirer from "inquirer";
import { saveSession } from "../../functions/session.js";
import { sleep } from "../../utils/sleep.js";
import { SettingsCommands } from "../../inquirer-commands/nested-commands/settings.js";
export async function SettingsActions(action, session, currentUser) {
    switch (action) {
        case "Add AI Providers Keys":
            const { openAIKey } = await inquirer.prompt([
                {
                    type: "input",
                    name: "openAIKey",
                    message: "Enter your OpenAI API key:",
                    validate: (input) => input.trim() !== "" || "OpenAI API key cannot be empty",
                },
            ]);
            session.openAIKey = openAIKey;
            await saveSession(session);
            console.log(chalk.green("OpenAI API key saved successfully! Going Back a step..."));
            sleep(2000);
            const newOpenAIAction = await SettingsCommands();
            //recursive call
            await SettingsActions(newOpenAIAction, session, currentUser);
            break;
        case "Set Notion Configurations":
            const { notionToken } = await inquirer.prompt([
                {
                    type: "input",
                    name: "notionToken",
                    message: "Enter your Notion API token:",
                    validate: (input) => input.trim() !== "" || "Notion API token cannot be empty",
                },
            ]);
            session.notionToken = notionToken;
            await saveSession(session);
            console.log(chalk.green("Notion API token saved successfully! Going Back a step..."));
            sleep(2000);
            const newNotionAction = await SettingsCommands();
            //recursive call
            await SettingsActions(newNotionAction, session, currentUser);
        case "Back":
            //recursive call
            const newAction = await promptAuthenticatedUser(currentUser);
            await handleAuthenticatedAction(newAction, currentUser, session);
            break;
    }
}
