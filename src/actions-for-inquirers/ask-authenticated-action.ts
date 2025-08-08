import chalk from "chalk";
import { HeadOutCommands } from "../inquirer-commands/nested-commands/headout.js";
import { HeadOutActions } from "./nested-actions-for-inquirers/headout-actions.js";
import { SettingsCommands } from "../inquirer-commands/nested-commands/settings.js";
import { SettingsActions } from "./nested-actions-for-inquirers/settings-actions.js";
import { checkChromaDocker } from "../utils/check-chromadocker.js";
import { promptAuthenticatedUser } from "../inquirer-commands/ask-authenticated.js";
import { LocalBrainActions } from "./nested-actions-for-inquirers/localbrain-actions.js";
import { LocalBrainCommands } from "../inquirer-commands/nested-commands/localbrain.js";
import { Session, UserStore } from "../types/index.js";
import { QuestionActions } from "./nested-actions-for-inquirers/question.js";
import { AskAQuestionCommands } from "../inquirer-commands/nested-commands/question.js";
import {
  getConversationHistory,
  readConversationFile,
} from "../helpers/history.js";
import { getCollection } from "../utils/chroma-client.js";
import inquirer from "inquirer";
import fs from "fs/promises";
import { createSpinner } from "nanospinner";
import { HistoryFile } from "../types/index.js";
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";
import path from "path";

export async function handleAuthenticatedAction(
  action: string,
  currentUserName: string,
  session: Session,
  users: UserStore
) {
  switch (action) {
    case "Ask a question🤔":
      const question = await AskAQuestionCommands();
      await QuestionActions(question, currentUserName, users, session);
      break;
    case "Add data to your local brain🧠":
      const isChromaDockerRunning = await checkChromaDocker();
      if (isChromaDockerRunning) {
        const action = await LocalBrainCommands();
        await LocalBrainActions(action, currentUserName, users, session);
      } else {
        console.log(
          chalk.red(
            "ChromaDB Docker is not running. Please start ChromaDB Docker and try again."
          )
        );
        const AskAgainAction = await promptAuthenticatedUser(currentUserName);
        await handleAuthenticatedAction(
          AskAgainAction,
          currentUserName,
          session,
          users
        );
      }
      break;
    case "History🔍":
      try {
        const histories = await getConversationHistory(currentUserName);

        if (histories.length === 0) {
          console.log("\nNo conversation history found.");
          const newAction = await promptAuthenticatedUser(currentUserName);
          await handleAuthenticatedAction(newAction, currentUserName, session, users);
          break;
        }

        const { selectedFile } = await inquirer.prompt([
          {
            type: "list",
            name: "selectedFile",
            message: "Select a conversation to view:",
            choices: histories.map((history: HistoryFile) => ({
              name: `[${history.timestamp}] ${history.firstQuestion.substring(
                0,
                60
              )}...`,
              value: history.filename,
            })),
          },
        ]);

        const conversations = await readConversationFile(selectedFile);
        console.log("\nConversation History:\n");
        conversations.forEach((entry, index) => {
          console.log(`\n--- Question ${index + 1} ---`);
          console.log(`Q: ${entry.question}`);
          console.log(`A: ${entry.response}`);
        });

        const newAction = await promptAuthenticatedUser(currentUserName);
        await handleAuthenticatedAction(newAction, currentUserName, session, users);
        break;
      } catch (error) {
        console.error("\nError retrieving conversation history:", error);
        const newAction = await promptAuthenticatedUser(currentUserName);
        await handleAuthenticatedAction(newAction, currentUserName, session, users);
        break;
      }
    case "Clear CLI🧹":
      console.clear();
      const newAction = await promptAuthenticatedUser(currentUserName);
      await handleAuthenticatedAction(
        newAction,
        currentUserName,
        session,
        users
      );
      break;
    case "Settings":
      const settingsAction = await SettingsCommands();
      await SettingsActions(settingsAction, session, currentUserName, users);
      break;
    case "Export Data":
      inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);
      const { exportFile } = await inquirer.prompt<{ exportFile: string }>([
        {
          type: "file-tree-selection",
          name: "exportFile",
          message: "Please select where to save the export file:",
        },
      ]);
      let finalExportPath = exportFile;
      try {
        const stat = await fs.stat(exportFile);
        if (stat.isDirectory()) {
          const { filename } = await inquirer.prompt<{ filename: string }>([
            {
              type: "input",
              name: "filename",
              message:
                "You've selected a directory. Please provide a name for the export file:",
              default: "ragvault-export.json",
            },
          ]);
          finalExportPath = path.join(exportFile, filename);
        }
      } catch (error: any) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }
      const exportSpinner = createSpinner("Exporting data...").start();
      try {
        const collection = await getCollection(currentUserName + "-ragvault");
        const data = await collection.get();
        await fs.writeFile(finalExportPath, JSON.stringify(data, null, 2));
        exportSpinner.success({
          text: `Data exported successfully to ${finalExportPath}`,
        });
      } catch (error) {
        exportSpinner.error({ text: `Error exporting data: ${error}` });
      }
      const newExportAction = await promptAuthenticatedUser(currentUserName);
      await handleAuthenticatedAction(
        newExportAction,
        currentUserName,
        session,
        users
      );
      break;
    case "Import Data":
      inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);
      const { importFile } = await inquirer.prompt<{ importFile: string }>([
        {
          type: "file-tree-selection",
          name: "importFile",
          message: "Please select the file to import:",
        },
      ]);
      try {
        const stat = await fs.stat(importFile);
        if (stat.isDirectory()) {
          console.log(
            chalk.red("\nError: You selected a directory. Please select a file to import.")
          );
          const newAction = await promptAuthenticatedUser(currentUserName);
          await handleAuthenticatedAction(
            newAction,
            currentUserName,
            session,
            users
          );
          return;
        }
      } catch (error: any) {
        if (error.code === "ENOENT") {
          console.log(chalk.red(`\nError: The file "${importFile}" does not exist.`));
        } else {
          console.error(`\nError checking file: ${error.message}`);
        }
        const newAction = await promptAuthenticatedUser(currentUserName);
        await handleAuthenticatedAction(
          newAction,
          currentUserName,
          session,
          users
        );
        return;
      }
      const importSpinner = createSpinner("Importing data...").start();
      try {
        const collection = await getCollection(currentUserName + "-ragvault");
        const data = await fs.readFile(importFile, "utf8");
        const parsedData = JSON.parse(data);
        await collection.add(parsedData);
        importSpinner.success({ text: "Data imported successfully" });
      } catch (error) {
        importSpinner.error({ text: `Error importing data: ${error}` });
      }
      const newImportAction = await promptAuthenticatedUser(currentUserName);
      await handleAuthenticatedAction(
        newImportAction,
        currentUserName,
        session,
        users
      );
      break;
    case "Head Out👋":
      const headOutAction = await HeadOutCommands();
      await HeadOutActions(headOutAction, session, currentUserName, users);
  }
}
