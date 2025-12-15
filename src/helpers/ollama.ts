import { ConversationEntry } from "../types/index.js";

const OLLAMA_BASE_URL = "http://localhost:11434/api";

interface OllamaModel {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details: {
        parent_model: string;
        format: string;
        family: string;
        families: string[];
        parameter_size: string;
        quantization_level: string;
    };
}

interface OllamaTagsResponse {
    models: OllamaModel[];
}

export async function isOllamaRunning(): Promise<boolean> {
  try {
    const response = await fetch(OLLAMA_BASE_URL.replace("/api", ""));
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function getOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/tags`);
    if (response.ok) {
      const data = await response.json() as OllamaTagsResponse;
      return data.models.map((model) => model.name);
    }
    return [];
  } catch (error) {
    console.error("Error fetching Ollama models. Make sure Ollama is running.");
    return [];
  }
}

export async function answerQuestionOllama(
  model: string,
  question: string,
  context: string,
  history: ConversationEntry[]
): Promise<string> {
  try {
    const systemPrompt = `You are a helpful assistant. Use the following pieces of context AND the conversation history to answer the user's question.
If the answer is not in the context, say you don't know, but you can try to answer based on your general knowledge if relevant.
Keep the answer concise and helpful.

Context:
${context}`;

    let prompt = "";
    if (history.length > 0) {
      prompt += "Conversation History:\n";
      history.forEach((entry) => {
        prompt += `User: ${entry.question}\nAssistant: ${entry.response}\n`;
      });
    }
    prompt += `\nUser: ${question}\nAssistant:`;

    const response = await fetch(`${OLLAMA_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        system: systemPrompt,
        stream: false,
      }),
    });

    if (response.ok) {
      const data = await response.json() as { response: string };
      return data.response;
    }
    return "No response from Ollama.";
  } catch (error) {
    console.error("Error generating response from Ollama:", error);
    return "Error generating response.";
  }
}
