import { client } from "./chroma-client.js";
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";

export async function generateCollectionName(username: string) {
  let collection = await client.getOrCreateCollection({
    name: `${username}-ragvault`,
    embeddingFunction: new DefaultEmbeddingFunction(),
    metadata: { "hnsw:space": "cosine" },
  });
  return collection;
}
