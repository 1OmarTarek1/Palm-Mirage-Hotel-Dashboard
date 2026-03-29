import { JWT } from "next-auth/jwt"
import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        id:String,
        user:UserDataI,
        token :String
    }

    interface UserDataI {
        name:String,
        email:String,
        role:String
    }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: UserDataI
    idToken?: string
    id?: string
  }
}