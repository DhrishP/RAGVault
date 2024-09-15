import inquirer from "inquirer";
export async function LocalBrainCommands() {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["Add Data using Terminal", "Add Data using PDF/DOCX", "Back"],
        },
    ]);
    return action;
}
