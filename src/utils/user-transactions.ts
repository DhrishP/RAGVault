import { USERS_FILE, USERNAME_FILE } from "../constant/index.js";
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
  // Also save usernames to a separate file as requested
  await fs.writeFile(USERNAME_FILE, JSON.stringify(Object.keys(users), null, 2));
}

export async function getUsernames(): Promise<string[]> {
  try {
    const data = await fs.readFile(USERNAME_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If username.json doesn't exist, try to populate it from users.json
    try {
        const users = await loadUsers();
        const usernames = Object.keys(users);
        await fs.writeFile(USERNAME_FILE, JSON.stringify(usernames, null, 2));
        return usernames;
    } catch {
        return [];
    }
  }
}
