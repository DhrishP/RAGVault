import { SESSION_FILE } from "../constant/index.js";
import fs from "fs/promises";
export async function loadSession() {
    try {
        const data = await fs.readFile(SESSION_FILE, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            return { currentUser: null };
        }
        throw error;
    }
}
export async function saveSession(session) {
    await fs.writeFile(SESSION_FILE, JSON.stringify(session, null, 2));
}
