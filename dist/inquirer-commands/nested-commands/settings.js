import inquirer from "inquirer";
export async function SettingsActions() {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Here are the list of settings",
            choices: ["Add OpenAI-key", "Set Notion Config", "", "Back"],
        },
    ]);
    return action;
}
