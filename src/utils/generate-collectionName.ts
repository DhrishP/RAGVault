import { client } from "./chroma-client.js";

export async function generateCollectionName(username: string) {
  let collection = await client.getOrCreateCollection({
    name: `${username}-ragvault` ,  
    metadata: { "hnsw:space": "cosine" },
  });
  return collection;
}
