import { DefaultSession, DefaultUser } from "next-auth";

type SessionUserData = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    user?: SessionUserData;
    token?: string;
  }

  interface Session extends DefaultSession {
    accessToken?: string;
    userId?: string;
    user: DefaultSession["user"] & SessionUserData;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: SessionUserData;
    accessToken?: string;
    id?: string;
  }
}

export {};
