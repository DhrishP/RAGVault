import { USERS_FILE } from "../constant/index.js";
import { UserStore } from "../types/index.js";
import fs from "fs/promises";

export async function loadUsers(): Promise<UserStore> {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

export async function saveUsers(users: UserStore): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}
