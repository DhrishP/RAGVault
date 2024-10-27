import inquirer from "inquirer";
import { GetFireworksInstance } from "../utils/ai-providers.js";
import { getCollection } from "../utils/chroma-client.js";
import { PromptTemplate } from "@langchain/core/prompts";

export const answerQuestionFireworks = async (
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
  const fireworks = GetFireworksInstance(apiKey);

  const prompt = PromptTemplate.fromTemplate(
    "You are a helpful assistant that can answer questions and help with tasks. You are given a question and a list of documents. You need to answer the question based on the given chunks of data. The chunks of data are: {context}. The question is: {question}.Do not recall that you are using chunks of data to answer the question. Talk like you are a human."
  );
  if (fireworks) {
    try {
      const chain = prompt.pipe(fireworks);
      const response = await chain.invoke({
        context: chunks.documents.join(","),
        question: query,
      });
      console.log("\n" + response.content + "\n");
    } catch (error) {
      console.log(error);
    }
  }
};
