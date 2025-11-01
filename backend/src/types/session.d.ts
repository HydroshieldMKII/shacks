import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    username: string;
    userPassword: string; // Store for encryption/decryption
  }
}
