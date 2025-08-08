import {
  ChromaClient
} from "chromadb";
import dotenv from "dotenv";
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";
import { loadSession } from "./session.js";
import { loadUsers } from "./user-transactions.js";
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";

dotenv.config();

export const client = new ChromaClient({ host:"localhost",port:8765 });
export const embeddingFunction = async () => {
  const session = await loadSession();
  const users = await loadUsers();
  const currentUser = session.currentUser;
  if (currentUser && session.embeddingLLM === "openai") {
    const modelName = users[currentUser.username].embeddingModelName;
    const apiKey = users[currentUser.username].openAIKey;
    if (modelName && apiKey) {
      return new OpenAIEmbeddingFunction({
        apiKey,
        modelName,
      });
    }
  }
  return new DefaultEmbeddingFunction();
};


export const getCollection = async (collectionName: string) => {
  const collection = client.getOrCreateCollection({ name: collectionName , embeddingFunction :await embeddingFunction()  });
  return collection;
};

