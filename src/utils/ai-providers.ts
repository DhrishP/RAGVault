import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export const GetFireworksInstance = (apiKey: string) => {
  try {
    const llm = new ChatFireworks({
      model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
      temperature: 0.2,
      apiKey: apiKey,
    });
    return llm;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const GetClaudeInstance = (apiKey: string) => {
  const anthropic = new Anthropic({
    apiKey: apiKey, // defaults to process.env["ANTHROPIC_API_KEY"]
  });
  return anthropic;
};

export const GetOpenAIInstance = (apiKey: string) => {
  const openai = new OpenAI({ apiKey: apiKey });
  return openai;
};
