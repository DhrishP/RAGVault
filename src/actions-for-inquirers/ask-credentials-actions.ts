import chalk from "chalk";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import { sleep } from "../utils/sleep.js";
import { saveSession } from "../functions/session.js";
import { HeadOutActions } from "../inquirer-commands/nested-commands/headout.js";
import { promptAuthenticatedUser } from "../inquirer-commands/ask-authenticated.js";
import { client, embeddingFunction } from "../utils/chroma-client.js";

export async function handleCredentialsAction(
  action: string,
  currentUser: string,
  session: any
) {
  switch (action) {
    case "Set Collection Name*":
      const res = await inquirer.prompt([
        {
          type: "input",
          name: "question",
          message: "Give the name for your collection of data?",
        },
      ]);
      await client.createCollection({
        embeddingFunction: embeddingFunction,
        name: `${res.question}`,
        metadata: { hnsw: "cosine" },
      });
      console.log(
        chalk.yellow(
          `The collection name is: ${res.question} , do not forget that data will be stored in this collection locally.`
        )
      );
      break;
    case "Add data to your local brain🧠":
      const { data } = await inquirer.prompt<{ data: string }>([
        {
          type: "input",
          name: "data",
          message: "What data would you like to store?",
        },
      ]);
      console.log(chalk.yellow(`You added: ${data}`));
      break;
    case "Clear CLI🧹":
      console.clear();
      break;
    case "Extras":
      console.log(chalk.yellow("Here are some extras!"));
      break;
    case "Settings":
      console.log(chalk.yellow("Here are your settings!"));
      break;
    case "Head Out👋":
      const action = await HeadOutActions();
      if (action === "Exit(Session will be saved)") {
        console.log(chalk.blueBright("You will be remembered , sergeant!"));
        process.exit(0);
      }
      if (action === "Logout") {
        const spinner = createSpinner("Logging out...").start();
        await sleep(1000);
        spinner.success({ text: chalk.green("Logged out successfully.") });
        session.currentUser = null;
        await saveSession(session);
        break;
      }
  }
}
