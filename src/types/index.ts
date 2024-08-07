export interface User {
  password: string;
  securityQuestion: string;
  securityAnswer: string;
}

export interface UserStore {
  [username: string]: User;
}

export interface Session {
  currentUser: string | null;
}
