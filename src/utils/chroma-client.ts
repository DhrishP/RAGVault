import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import dotenv from "dotenv";
dotenv.config();

export const client = new ChromaClient({ path: "http://localhost:8000" });

export const embeddingFunction = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY!,
  openai_model: "text-embedding-3-small",
});
