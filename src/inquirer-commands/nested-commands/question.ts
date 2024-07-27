import inquirer from "inquirer";

export async function AskAQuestionCommands() {
  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["Using Local LLM", "Using Remote LLM", "Back"],
    },
  ]);
  return action;
}
