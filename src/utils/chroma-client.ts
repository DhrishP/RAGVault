import {
  ChromaClient
} from "chromadb";
import dotenv from "dotenv";
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";
import { loadSession } from "./session.js";
import { loadUsers } from "./user-transactions.js";

dotenv.config();

export const client = new ChromaClient({ host:"localhost",port:8765 });

export const getCollection = async (collectionName: string) => {
  const collection = client.getOrCreateCollection({ name: collectionName });
  return collection;
};

export const embeddingFunction = async () => {
  const session = await loadSession();
  const users = await loadUsers();
  const currentUser = session.currentUser;
  if (currentUser && session.embeddingLLM === "openai") {
    const modelName = users[currentUser.username].embeddingModelName;
    return new OpenAIEmbeddingFunction({
      apiKey: users[currentUser.username].openAIKey || "",
      modelName: modelName || "text-embedding-3-small",
    });
  }
  return new OpenAIEmbeddingFunction({
    apiKey: process.env.OPENAI_API_KEY || "HI-TST-1",
    modelName: "text-embedding-3-small",
  });
};
