export interface User {
  password: string;
  securityQuestion: string;
  securityAnswer: string;
  openAIKey: string;
  collectionName: string;
  notionToken?: string;
  notionDatabaseId?: string;
}

export interface UserStore {
  [username: string]: User;
}

export interface Session {
  currentUser: string | null;
}
