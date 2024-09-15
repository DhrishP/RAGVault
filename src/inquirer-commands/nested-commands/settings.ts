import inquirer from "inquirer";

export async function SettingsCommands() {
  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: "list",
      name: "action",
      message: "Here are the list of settings",
      choices: ["Add AI Providers Keys", "Set Notion Configurations", "Back"],
    },
  ]);
  return action;
}
