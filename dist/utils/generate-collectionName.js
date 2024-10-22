import { client } from "./chroma-client.js";
import { DefaultEmbeddingFunction } from "chromadb";
export async function generateCollectionName(username) {
    let collection = await client.getOrCreateCollection({
        name: `${username}-ragvault`,
        embeddingFunction: new DefaultEmbeddingFunction(),
        metadata: { "hnsw:space": "cosine" },
    });
    return collection;
}
