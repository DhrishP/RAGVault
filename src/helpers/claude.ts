import inquirer from "inquirer";
import { GetClaudeInstance } from "../utils/ai-providers.js";
import { getCollection } from "../utils/chroma-client.js";

export const answerQuestionClaude = async (
  apiKey: string,
  username: string
) => {
  const collection = await getCollection(username + "-ragvault");
  const { query } = await inquirer.prompt([
    {
      type: "input",
      name: "query",
      message: "Enter your query here",
    },
  ]);
  const chunks = await collection.query({
    queryTexts: [query],
    nResults: 2,
  });

  const anthropic = GetClaudeInstance(apiKey);
  const response = await anthropic.messages.create({
    messages: [
      {
        role: "assistant",
        content: `You are a helpful assistant that can answer questions about the provided chunks as context. ${chunks}`,
      },
      { role: "user", content: query },
    ],
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
  });
  console.log("\n", response.content + "\n");
  return response.content;
};
