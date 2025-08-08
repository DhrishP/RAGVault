import {
  ChromaClient
} from "chromadb";
import dotenv from "dotenv";
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";

dotenv.config();

export const client = new ChromaClient({ host:"localhost",port:8765 });

export const getCollection = async (collectionName: string) => {
  const collection = client.getOrCreateCollection({ name: collectionName });
  return collection;
};

export const embeddingFunction = new OpenAIEmbeddingFunction({
  apiKey: process.env.OPENAI_API_KEY||"HI-TST-1",
  modelName: "text-embedding-3-small",
});
