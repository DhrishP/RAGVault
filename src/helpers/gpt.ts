import inquirer from "inquirer";
import { getCollection } from "../utils/chroma-client.js";

export const answerQuestionOpenAI = async (
  apiKey: string,
  username: string,
  query: string
) => {
  const collection = await getCollection(username + "-ragvault");
  const chunks = await collection.query({
    queryTexts: [query],
    nResults: 2,
  });

  const messages = [
    {
      role: "assistant",
      content: `You are a helpful assistant that can answer questions about the provided chunks. ${JSON.stringify(chunks)}`,
    },
    { role: "user", content: query },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "";
  console.log("\n", answer + "\n");
  return answer;
};
