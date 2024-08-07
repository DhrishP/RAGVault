#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { sleep } from "./utils/sleep.js";
import { loadUsers } from "./functions/user-transactions.js";
import { loadSession, saveSession } from "./functions/session.js";
import { ensureAppDir } from "./utils/cli-helpers.js";
import { displayTitle } from "./functions/cli-ux.js";
import { promptAuthenticatedUser } from "./inquirer-actions/ask-authenticated.js";
import { handleUnauthenticatedAction } from "./inquirer-actions/ask-unauthenticated.js";

async function promptUnauthenticatedUser() {
  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["Login", "Register", "Reset Password", "Exit"],
    },
  ]);
  return action;
}

async function handleAuthenticatedAction(
  action: string,
  currentUser: string,
  session: any
) {
  switch (action) {
    case "Ask a question":
      const { question } = await inquirer.prompt<{ question: string }>([
        {
          type: "input",
          name: "question",
          message: "What's your question?",
        },
      ]);
      console.log(chalk.yellow(`You asked: ${question}`));
      console.log(
        chalk.gray(
          "I'm an AI assistant, so I can't actually answer that question. But it's a great one!"
        )
      );
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

export async function mainInq(): Promise<void> {
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
    } else {
      const action = await promptAuthenticatedUser(currentUser);
      await handleAuthenticatedAction(action, currentUser, session);
      if (!session.currentUser) currentUser = null;
    }
  }
}

mainInq();
