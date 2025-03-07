import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: number | null;
      username?: string | null;
      role?: string;
    };
  }
}
