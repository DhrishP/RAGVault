import chalk from "chalk";
import inquirer from "inquirer";
import { UserStore } from "../types/index.js";
import { createSpinner } from "nanospinner";
import { sleep } from "../utils/sleep.js";
import { hashPassword } from "../utils/bcrypt.js";
import bcrypt from "bcrypt";
import { saveUsers } from "./user-transactions.js";

export async function resetPassword(users: UserStore): Promise<void> {
  const { username } = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Enter your username:",
      validate: (input: string) =>
        input.trim() !== "" || "Username cannot be empty",
    },
  ]);

  if (!users[username]) {
    console.log(chalk.red("Username not found."));
    return;
  }

  console.log(
    chalk.blue(`Security Question: ${users[username].securityQuestion}`)
  );
  const { securityAnswer } = await inquirer.prompt([
    {
      type: "password",
      name: "securityAnswer",
      message: "Enter your answer:",
      validate: (input: string) =>
        input.trim() !== "" || "Answer cannot be empty",
    },
  ]);

  const spinner = createSpinner("Verifying answer...").start();
  await sleep(1000);

  if (await bcrypt.compare(securityAnswer, users[username].securityAnswer)) {
    spinner.success({
      text: chalk.green("Answer correct. You can now reset your password."),
    });
    const { newPassword } = await inquirer.prompt([
      {
        type: "password",
        name: "newPassword",
        message: "Enter your new password:",
        validate: (input: string) =>
          input.trim().length >= 8 ||
          "Password must be at least 8 characters long",
      },
      {
        type: "password",
        name: "confirmNewPassword",
        message: "Confirm your new password:",
        validate: (input: string, answers: any) =>
          input === answers.newPassword || "Passwords do not match",
      },
    ]);

    users[username].password = await hashPassword(newPassword);
    await saveUsers(users);
    console.log(chalk.green("Password reset successful!"));
  } else {
    spinner.error({
      text: chalk.red("Incorrect answer. Password reset failed."),
    });
  }
}
