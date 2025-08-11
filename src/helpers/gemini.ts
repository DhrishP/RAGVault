import inquirer from "inquirer";
import { getCollection } from "../utils/chroma-client.js";

export const answerQuestionGemini = async (
  key: string,
  username: string,
  query: string,
  conversationHistory: { question: string; response: string }[]
) => {
  const collection = await getCollection(username + "-ragvault");

  const chunks = await collection.query({
    queryTexts: [query],
    nResults: 2,
  });
  console.log(chunks, "chunks");

  const historyContents = conversationHistory.flatMap((h) => [
    { role: "user", parts: [{ text: h.question }] },
    { role: "model", parts: [{ text: h.response }] },
  ]);

  // Prepare the prompt using the retrieved chunks
  const prompt = `You are a helpful assistant that can answer questions about the provided chunks. ${chunks.documents[0]
    .map((doc) => doc)
    .join("\n")}\n\nQuestion: ${query}`;

  // Prepare the request body for Gemini REST API
  const body = {
    contents: [
      ...historyContents,
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  // Extract the response text from the Gemini API response
  const answer =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response from Gemini API.";

  console.log("\n", answer + "\n");
  return answer;
};
