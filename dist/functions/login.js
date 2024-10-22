import chalk from "chalk";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import { sleep } from "../utils/sleep.js";
import bcrypt from "bcrypt";
export async function login(users) {
    const { username, password } = await inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "Enter your username:",
            validate: (input) => input.trim() !== "" || "Username cannot be empty",
        },
        {
            type: "password",
            name: "password",
            message: "Enter your password:",
            validate: (input) => input.trim() !== "" || "Password cannot be empty",
        },
    ]);
    const spinner = createSpinner("Logging in...").start();
    await sleep(1000);
    if (!users[username]) {
        spinner.error({ text: chalk.red("Username not found.") });
        return null;
    }
    if (await bcrypt.compare(password, users[username].password)) {
        spinner.success({ text: chalk.green("Login successful!") });
        return users[username];
    }
    else {
        spinner.error({ text: chalk.red("Invalid password.") });
        return null;
    }
}
