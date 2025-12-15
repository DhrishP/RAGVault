import inquirer from "inquirer";

export async function promptUnauthenticatedUser() {
  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["Login", "Register", "Reset Password", "Forgot Username", "Exit"],
    },
  ]);
  return action;
}
