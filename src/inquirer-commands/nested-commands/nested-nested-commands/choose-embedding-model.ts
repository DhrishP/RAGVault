import inquirer from "inquirer";

export async function ChooseEmbeddingModel() {
  const { embeddingModel } = await inquirer.prompt<{ embeddingModel: string }>([
    {
      type: "list",
      name: "embeddingModel",
      message: "Choose an embedding model:",
      choices: ["OpenAI", "Back"],
    },
  ]);
  return embeddingModel;
} 