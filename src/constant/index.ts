import path from "path";
import os from "os";
import dotenv from "dotenv";
import { getAppDataPath, joinPaths } from "../utils/platform.js";
dotenv.config();

export const APP_NAME = process.env.npm_package_name || "ragvault";
export const APP_DIR = getAppDataPath(APP_NAME);
export const USERS_FILE = joinPaths(APP_DIR, "users.json");
export const SESSION_FILE = joinPaths(APP_DIR, "session.json");
export const HISTORY_DIR = joinPaths(APP_DIR, "conversation-history");
