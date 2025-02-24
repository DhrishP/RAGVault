import inquirer from "inquirer";
import { Session, UserStore } from "../../types/index.js";
import { getCollection } from "../../utils/chroma-client.js";
import { nanoid } from "nanoid";
import { createSpinner } from "nanospinner";
import { sleep } from "../../utils/sleep.js";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { promptAuthenticatedUser } from "../../inquirer-commands/ask-authenticated.js";
import { handleAuthenticatedAction } from "../ask-authenticated-action.js";

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
      const { filePath } = await inquirer.prompt<{ filePath: string }>([
        {
          type: "input",
          name: "filePath",
          message: "Please enter the path to your PDF or DOCX file:",
        },
      ]);

      const trimmedFilePath = filePath.trim();
      const fileExtension = trimmedFilePath.split(".").pop()?.toLowerCase();

      try {
        let extractedText = "";
        if (fileExtension === "pdf") {
          const loader = new PDFLoader(trimmedFilePath);
          const docs = await loader.load();
          extractedText = docs.map((doc) => doc.pageContent).join("\n");
        } else if (fileExtension === "docx") {
          const loader = new DocxLoader(trimmedFilePath);
          const docs = await loader.load();
          extractedText = docs.map((doc) => doc.pageContent).join("\n");
        } else {
          console.log(
            "Unsupported file type. Please provide a .pdf or .docx file."
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
