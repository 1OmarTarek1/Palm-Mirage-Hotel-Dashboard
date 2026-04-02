declare module "next-auth" {
    interface User {
        id:string,
        user:UserDataI,
        token :string
    }

    interface UserDataI {
        name:string,
        email:string,
        role:string
    }

    interface Session {
        accessToken?: string
    }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: UserDataI
    accessToken?: string
    id?: string
  }
}
