import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

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
