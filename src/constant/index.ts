import path from "path";
import os from "os";
import dotenv from "dotenv";
dotenv.config();

export const APP_NAME = process.env.npm_package_name;
export const APP_DIR = path.join(os.homedir(), `.${APP_NAME}`);
export const USERS_FILE = path.join(APP_DIR, "users.json");
export const SESSION_FILE = path.join(APP_DIR, "session.json");
