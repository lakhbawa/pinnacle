
import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string; // Declare the 'id' property here
    } & DefaultSession['user'];
  }
}
