export interface User {
  username: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
  openAIKey?: string;
  collectionName: string;
  notionToken?: string;
  notionDatabaseId?: string;
  claudeKey?: string;
  fireworksKey?: string;
  geminiKey?: string;
}

export interface UserStore {
  [username: string]: User;
}

export interface Session {
  currentUser: User | null;
  answerLLM: LLM | null;
}

export enum LLM {
  OPENAI = "openai",
  CLAUDE = "claude",
  FIREWORKS = "fireworks",
  GEMINI = "gemini",
}

export interface ConversationEntry {
  question: string;
  response: string;
}

export interface HistoryFile {
  firstQuestion: string;
  filename: string;
  timestamp: string;
}
