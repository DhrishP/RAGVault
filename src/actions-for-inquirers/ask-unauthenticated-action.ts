import chalk from "chalk";
import inquirer from "inquirer";
import { login } from "./nested-actions-for-inquirers/login.js";
import { register } from "./nested-actions-for-inquirers/register.js";
import { resetPassword } from "./nested-actions-for-inquirers/reset-pass.js";
import { Session, UserStore } from "../types/index.js";
import { comparePassword } from "../utils/bcrypt.js";

export async function handleUnauthenticatedAction(
  action: string,
  users: UserStore,
  session: Session
) {
  switch (action) {
    case "Login":
      return await login(users);
    case "Register":
      return await register(users, session);
    case "Reset Password":
      await resetPassword(users);
      return null;
    case "Forgot Username":
      const usernames = Object.keys(users);
      if (usernames.length === 0) {
        console.log(chalk.yellow("\nNo users found.\n"));
        return null;
      }

      // Collect all unique security questions
      const securityQuestions = new Set<string>();
      usernames.forEach(username => {
        if (users[username].securityQuestion) {
          securityQuestions.add(users[username].securityQuestion);
        }
      });

      if (securityQuestions.size === 0) {
        console.log(chalk.yellow("\nNo security questions set for any users.\n"));
        return null;
      }

      const { selectedQuestion } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedQuestion",
          message: "Select your security question:",
          choices: Array.from(securityQuestions),
        },
      ]);

      const { answer } = await inquirer.prompt([
        {
          type: "password",
          name: "answer",
          message: "Enter the answer to your security question:",
        },
      ]);

      let foundUsername: string | null = null;

      for (const username of usernames) {
        const user = users[username];
        if (user.securityQuestion === selectedQuestion) {
          const isMatch = await comparePassword(answer, user.securityAnswer);
          if (isMatch) {
            foundUsername = username;
            break;
          }
        }
      }

      if (foundUsername) {
        console.log(chalk.green(`\nYour username is: ${chalk.bold(foundUsername)}\n`));
      } else {
        console.log(chalk.red("\nIncorrect security answer.\n"));
      }

      return null;
    case "Exit":
    default:
      console.log(chalk.yellow("Goodbye!"));
      process.exit();
  }
}
