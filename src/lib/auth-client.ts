"use client";

import { signOut } from "next-auth/react";

export async function handleExpiredSession() {
  await signOut({
    redirect: true,
    callbackUrl: "/login",
  });
}
