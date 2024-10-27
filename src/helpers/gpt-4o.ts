import inquirer from "inquirer";
import { GetOpenAIInstance } from "../utils/ai-providers.js";
import { getCollection } from "../utils/chroma-client.js";

export const answerQuestionOpenAI = async (
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
  const openai = GetOpenAIInstance(apiKey);
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "assistant",
        content: `You are a helpful assistant that can answer questions about the provided chunks. ${chunks}`,
      },
      { role: "user", content: query },
    ],
    model: "gpt-4o",
  });
  console.log("\n", response.choices[0].message.content + "\n");
  return response.choices[0].message.content;
};
