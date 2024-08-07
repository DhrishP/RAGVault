import fs from "fs/promises";
import { APP_DIR } from "../constant/index.js";
import chalk from "chalk";
export async function ensureAppDir() {
    try {
        await fs.mkdir(APP_DIR, { recursive: true });
    }
    catch (error) {
        console.error(chalk.red("Failed to create app directory:"), error);
        process.exit(1);
    }
}
