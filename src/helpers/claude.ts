import inquirer from "inquirer";
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

  // Prepare the prompt using the retrieved chunks
  const prompt = `You are a helpful assistant that can answer questions about the provided chunks as context. ${chunks.documents[0]
    .map((doc) => doc)
    .join("\n")}\n\nQuestion: ${query}`;

  // Prepare the request body for Anthropic Claude API
  const body = {
    model: "claude-opus-4-1-20250805",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  // Extract the response text from the Claude API response
  // Claude's response is in data.content, which is an array of message parts
  const answer =
    Array.isArray(data.content) && data.content.length > 0 && data.content[0].text
      ? data.content[0].text
      : "No response from Claude API.";

  console.log("\n", answer + "\n");
  return answer;
};
