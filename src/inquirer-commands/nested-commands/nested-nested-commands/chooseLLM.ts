import inquirer from "inquirer";

export async function ChooseLLMCommands() {
  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: "list",
      name: "action",
      message: "Choose a remote LLM:",
      choices: ["openAI", "claude", "fireworks", "Back"],
    },
  ]);
  return action;
}
