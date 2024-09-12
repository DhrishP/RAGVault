import chalk from "chalk";
import inquirer from "inquirer";
export async function promptCredentials(currentUser, users) {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: chalk.cyan(`Hello there, ${currentUser}! Please add your credentials for fully enjoying our product. The optional credentials can be added later in settings.`),
            choices: [
                "Set Collection Name*",
                "Add OPENAI-KEY(optional)",
                "Add Notion Credentials(optional)",
            ],
        },
    ]);
    return action;
}
