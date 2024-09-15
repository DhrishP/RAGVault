import chalk from "chalk";
import inquirer from "inquirer";
export async function promptAuthenticatedUser(currentUser) {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: chalk.cyan(`Welcome back, ${currentUser}! What would you like to do?`),
            choices: [
                "Ask a question🤔",
                "Add data to your local brain🧠",
                "Clear CLI🧹",
                "Extras",
                "Settings",
                "Head Out👋",
            ],
        },
    ]);
    return action;
}
