export interface User {
  username: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
  openAIKey: string;
  collectionName: string;
  notionToken?: string;
  notionDatabaseId?: string;
  claudeKey?: string;
  fireworksKey: string;
  geminiKey: string;
}

export interface UserStore {
  [username: string]: User;
}

export interface Session {
  currentUser: User | null;
  answerLLM: LLM | null; // FOR FUTURE USE
}

export enum LLM {
  // FOR FUTURE USE
  OPENAI = "openai",
  CLAUDE = "claude",
  FIREWORKS = "fireworks",
  GEMINI = "gemini",
  CHROMADB = "chromadb",
}
