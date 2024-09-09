import inquirer from "inquirer";
export async function HeadOutActions() {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["Exit(Session will be saved)", "Logout"],
        },
    ]);
    return action;
}
