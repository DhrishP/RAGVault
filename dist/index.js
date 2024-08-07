#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import { sleep } from "./utils/sleep.js";
import { loadUsers } from "./functions/user-transactions.js";
import { loadSession, saveSession } from "./functions/session.js";
import { login } from "./functions/login.js";
import { register } from "./functions/register.js";
import { resetPassword } from "./functions/reset-pass.js";
import { ensureAppDir } from "./utils/cli-helpers.js";
async function displayTitle() {
    const title = chalkAnimation.rainbow("Welcome to the Authenticated CLI App");
    await sleep(2000);
    title.stop();
}
async function promptUnauthenticatedUser() {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["Login", "Register", "Reset Password", "Exit"],
        },
    ]);
    return action;
}
async function promptAuthenticatedUser(currentUser) {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: chalk.cyan(`Welcome back, ${currentUser}! What would you like to do?`),
            choices: ["Ask a question", "Logout"],
        },
    ]);
    return action;
}
async function handleUnauthenticatedAction(action, users, session) {
    switch (action) {
        case "Login":
            return await login(users);
        case "Register":
            return await register(users);
        case "Reset Password":
            await resetPassword(users);
            return null;
        case "Exit":
        default:
            console.log(chalk.yellow("Goodbye!"));
            process.exit();
    }
}
async function handleAuthenticatedAction(action, currentUser, session) {
    switch (action) {
        case "Ask a question":
            const { question } = await inquirer.prompt([
                {
                    type: "input",
                    name: "question",
                    message: "What's your question?",
                },
            ]);
            console.log(chalk.yellow(`You asked: ${question}`));
            console.log(chalk.gray("I'm an AI assistant, so I can't actually answer that question. But it's a great one!"));
            break;
        case "Logout":
            const spinner = createSpinner("Logging out...").start();
            await sleep(1000);
            spinner.success({ text: chalk.green("Logged out successfully.") });
            session.currentUser = null;
            await saveSession(session);
            break;
    }
}
export async function mainInq() {
    await ensureAppDir();
    const users = await loadUsers();
    let session = await loadSession();
    let currentUser = session.currentUser;
    await displayTitle();
    while (true) {
        if (!currentUser) {
            const action = await promptUnauthenticatedUser();
            currentUser = await handleUnauthenticatedAction(action, users, session);
            if (currentUser) {
                session.currentUser = currentUser;
                await saveSession(session);
            }
        }
        else {
            const action = await promptAuthenticatedUser(currentUser);
            await handleAuthenticatedAction(action, currentUser, session);
            if (!session.currentUser)
                currentUser = null;
        }
    }
}
mainInq();
