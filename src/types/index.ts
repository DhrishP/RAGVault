export interface User {
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
  currentUser: string | null;
  notionToken: string | null;
  notionDatabaseId: string | null;
  openAIKey: string | null;
  claudeKey: string | null;
  fireworksKey: string | null;
  geminiKey: string | null;
}
