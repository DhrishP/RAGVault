import chalk from "chalk";
import inquirer from "inquirer";
import { UserStore } from "../types/index.js";
import { createSpinner } from "nanospinner";
import { sleep } from "../utils/sleep.js";
import { hashPassword } from "../utils/bcrypt.js";
import { saveUsers } from "./user-transactions.js";

export async function register(users: UserStore): Promise<string | null> {
  const {
    username,
    password,
    confirmPassword,
    securityQuestion,
    securityAnswer,
  } = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Choose a username:",
      validate: (input: string) =>
        input.trim() !== "" || "Username cannot be empty",
    },
    {
      type: "password",
      name: "password",
      message: "Choose a password:",
      validate: (input: string) =>
        input.trim().length >= 8 ||
        "Password must be at least 8 characters long",
    },
    {
      type: "password",
      name: "confirmPassword",
      message: "Confirm your password:",
      validate: (input: string, answers: any) =>
        input === answers.password || "Passwords do not match",
    },
    {
      type: "input",
      name: "securityQuestion",
      message: "Enter a security question for password reset:",
      validate: (input: string) =>
        input.trim() !== "" || "Security question cannot be empty",
    },
    {
      type: "password",
      name: "securityAnswer",
      message: "Enter the answer to your security question:",
      validate: (input: string) =>
        input.trim() !== "" || "Security answer cannot be empty",
    },
  ]);

  const spinner = createSpinner("Registering...").start();
  await sleep(1000);

  if (users[username]) {
    spinner.error({
      text: chalk.red("Username already exists. Please choose another."),
    });
    return null;
  }

  users[username] = {
    password: await hashPassword(password),
    securityQuestion,
    securityAnswer: await hashPassword(securityAnswer),
    openAIKey: "",
    collectionName: "",
    fireworksKey: "MaTLjtWER5HplbJQBJXVq1Mo70LTudI6GbQb3Gobf6XbOvJN",
    geminiKey: "AIzaSyDzmPffYdq4w9H4ZoT1zMRCagepCMCIYvg",
    claudeKey: "",
  };
  await saveUsers(users);
  spinner.success({ text: chalk.green("Registration successful!") });
  return username;
}
