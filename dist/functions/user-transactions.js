import { USERS_FILE } from "../constant/index.js";
import fs from "fs/promises";
export async function loadUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            return {};
        }
        throw error;
    }
}
export async function saveUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}
