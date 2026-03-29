import { userService } from "./../services/user.service";
import { AsyncThunk } from "./../../node_modules/@reduxjs/toolkit/src/createAsyncThunk";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

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
        const response = await fetch("http://localhost:5000/auth/login", {
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
          const user = data.user || data.data?.user || data.data;

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
        token.user = user.user;
        token.token = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
};
