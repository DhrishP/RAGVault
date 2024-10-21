import { SESSION_FILE } from "../constant/index.js";
import { Session } from "../types/index.js";
import fs from "fs/promises";

export async function loadSession(): Promise<Session> {
  try {
    const data = await fs.readFile(SESSION_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {
        currentUser: null,
        answerLLM: null,
      };
    }
    throw error;
  }
}

export async function saveSession(session: Session): Promise<void> {
  await fs.writeFile(SESSION_FILE, JSON.stringify(session, null, 2));
}
