import inquirer from "inquirer";

export async function HeadOutCommands() {
  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["Exit(Session will be saved)", "Logout", "Back"],
    },
  ]);
  return action;
}
