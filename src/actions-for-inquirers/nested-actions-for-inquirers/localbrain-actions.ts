import inquirer from "inquirer";
import { Session, UserStore } from "../../types/index.js";
import { getCollection } from "../../utils/chroma-client.js";
import { nanoid } from "nanoid";
import { createSpinner } from "nanospinner";
import pdf from "pdf-parse";
import fs from "fs/promises";
import { promptAuthenticatedUser } from "../../inquirer-commands/ask-authenticated.js";
import { handleAuthenticatedAction } from "../ask-authenticated-action.js";
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";

export const LocalBrainActions = async (
  action: string,
  username: string,
  users: UserStore,
  session: Session
) => {
  switch (action) {
    case "Add Data using Terminal":
      try {
        const { data } = await inquirer.prompt<{ data: string }>([
          {
            type: "input",
            name: "data",
            message: "What data would you like to store?",
          },
        ]);
        const collection = await getCollection(username + "-ragvault");
        const spinner = createSpinner("Adding Data...").start();
        await collection.add({
          documents: [data],
          ids: [nanoid()],
        });
        spinner.success({ text: "\nData added to local brain\n" });
        const newActionSucess = await promptAuthenticatedUser(username);
        await handleAuthenticatedAction(
          newActionSucess,
          username,
          session,
          users
        );
        break;
      } catch (error) {
        console.error("Error adding data:", error);
        break;
      }
    case "Add Data using PDF/DOCX":
      inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);
      const { filePath } = await inquirer.prompt<{ filePath: string }>([
        {
          type: "file-tree-selection",
          name: "filePath",
          message: "Please select a PDF, TXT or MD file:",
        },
      ]);

      const trimmedFilePath = filePath.trim();
      const fileExtension = trimmedFilePath.split(".").pop()?.toLowerCase();

      try {
        let extractedText = "";
        if (fileExtension === "pdf") {
          const dataBuffer = await fs.readFile(trimmedFilePath);
          const data = await pdf(dataBuffer);
          extractedText = data.text;
        } else if (fileExtension === "txt" || fileExtension === "md") {
          extractedText = await fs.readFile(trimmedFilePath, "utf-8");
        } else {
          console.log(
            "Unsupported file type. Please provide a .pdf, .txt or .md file."
          );
          return;
        }
        const collection = await getCollection(username + "-ragvault");
        const spinner = createSpinner("Adding Data...").start();
        await collection.add({
          documents: [extractedText],
          ids: [nanoid()],
        });
        spinner.success({ text: "\nData added to local brain\n" });
        const newActionSucess = await promptAuthenticatedUser(username);
        await handleAuthenticatedAction(
          newActionSucess,
          username,
          session,
          users
        );
        break;
      } catch (error) {
        console.error("Error reading the file:", error);
        return;
      }
    case "Back":
      const newActionBack = await promptAuthenticatedUser(username);
      await handleAuthenticatedAction(newActionBack, username, session, users);
      break;
  }
};
