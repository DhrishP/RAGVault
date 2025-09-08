import fs from "fs/promises";
import path from "path";
import { ConversationEntry, HistoryFile } from "../types/index.js";
import { HISTORY_DIR } from "../constant/index.js";
import { joinPaths } from "../utils/platform.js";

export async function getConversationHistory(
  username: string
): Promise<HistoryFile[]> {
  try {
    await fs.mkdir(HISTORY_DIR, { recursive: true });
    const files = await fs.readdir(HISTORY_DIR);

    // Filter files for the specific user
    const userFiles = files.filter((file) =>
      file.startsWith(`chat-${username}-`)
    );

    // Read first question from each file
    const historyFiles: HistoryFile[] = await Promise.all(
      userFiles.map(async (filename) => {
        const content = await fs.readFile(
          joinPaths(HISTORY_DIR, filename),
          "utf-8"
        );
        try {
          const conversations = JSON.parse(content);
          return {
            firstQuestion: conversations[0]?.question || "Unknown question",
            filename,
            timestamp: filename
              .split("-")
              .slice(3)
              .join("-")
              .replace(".txt", ""),
          };
        } catch (error) {
          return {
            firstQuestion: "Error reading conversation",
            filename,
            timestamp: filename
              .split("-")
              .slice(3)
              .join("-")
              .replace(".txt", ""),
          };
        }
      })
    );
    return historyFiles;
  } catch (error) {
    console.error("Error getting conversation history:", error);
    return [];
  }
}

export async function readConversationFile(
  filename: string
): Promise<ConversationEntry[]> {
  try {
    const filePath = joinPaths(HISTORY_DIR, filename);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to read conversation file:", error);
    return [];
  }
}

export const saveConversationHistory = async (
  conversationHistory: ConversationEntry[],
  username: string
): Promise<void> => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await fs.mkdir(HISTORY_DIR, { recursive: true });
    const filename = joinPaths(
      HISTORY_DIR,
      `chat-${username}-${timestamp}.txt`
    );

    await fs.writeFile(
      filename,
      JSON.stringify(conversationHistory, null, 2),
      "utf-8"
    );
    console.log(`\nConversation history saved to: ${filename}`);
  } catch (error) {
    console.error("\nFailed to save conversation history:", error);
  }
};
