import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

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
