import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

type AuthorizedUser = {
  id: string;
  user: {
    name?: string;
    email?: string;
    role?: string;
  };
  token: string;
};

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        
          placeholder: "Please Enter Your Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "******",
        },
      },
      authorize: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("NextAuth Authorize Response:", data);

        if (data.message === "Done") {
          // Broad search for the token: data.token, data.accessToken, or nested in data.data
          const token =
            data.token ||
            data.accessToken ||
            data.data?.token ||
            data.data?.accessToken;

          if (!token || typeof token !== "string") {
            const availableKeys = Object.keys(data).join(", ");
            const nestedKeys = data.data ? Object.keys(data.data).join(", ") : "none";
            console.error(
              "Token extraction failed. Root keys:",
              availableKeys,
              "Data keys:",
              nestedKeys
            );
            throw new Error(`Auth success but token missing. Keys: ${availableKeys}`);
          }

          // Broad search for the user object
          const user = {
            ...(data.user || data.data?.user || data.data || {}),
          };

          // Fallback user details from credentials if they are missing in the response
          if (!user.email && credentials?.email) user.email = credentials.email;
          if (!user.name && user.email) user.name = (user.email as string).split("@")[0];

          const decodedToken: { id: string } = jwtDecode(token);
          return {
            id: decodedToken.id,
            user: user,
            token: token,
          };
        } else {
          throw new Error(data.message || "Wrong Credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authorizedUser = user as AuthorizedUser;
        token.user = authorizedUser.user;
        token.accessToken = authorizedUser.token;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};
