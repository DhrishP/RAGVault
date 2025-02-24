import inquirer from "inquirer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCollection } from "../utils/chroma-client.js";

export const answerQuestionGemini = async (key: string, username: string) => {
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
  console.log(chunks, "chunks");

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are a helpful assistant that can answer questions about the provided chunks. ${chunks.documents[0]
    .map((doc) => doc)
    .join("\n")}\n\nQuestion: ${query}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  console.log("\n", response + "\n");
  return response;
};
