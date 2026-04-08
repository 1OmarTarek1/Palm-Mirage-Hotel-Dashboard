"use client";

import Image from "next/image";
import { CalendarClock, Mail, ShieldCheck, User } from "lucide-react";
import { useSession } from "next-auth/react";

import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import SubHeader from "@/components/shared/header/SubHeader";
import type { ActiveUser } from "@/components/shared/navbar/types";

export default function ProfilePageContent() {
  const { data: session, status } = useSession();
  const user = session?.user as ActiveUser | undefined;
  const displayName = user?.name || "—";
  const displayEmail = user?.email || "—";
  const displayAvatar = user?.image || user?.avatarUrl;
  const statusLabel =
    status === "loading" ? "Syncing session" : status === "authenticated" ? "Authenticated" : "Signed out";

  return (
    <DashboardPageShell>
      <SubHeader
        title="My profile"
        description="Signed-in account details for this dashboard session."
      />
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        {status === "loading" ? (
          <div className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-56 animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-44 animate-pulse rounded bg-muted/50" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative mx-auto h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted sm:mx-0">
              {displayAvatar ? (
                <Image
                  src={displayAvatar}
                  alt={displayName === "—" ? "Profile photo" : `${displayName} profile photo`}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>
            <dl className="min-w-0 flex-1 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-muted-foreground">Name</dt>
                <dd className="mt-1 font-semibold text-foreground">{displayName}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Email</dt>
                <dd className="mt-1 break-all font-semibold text-foreground">
                  {displayEmail}
                </dd>
              </div>
              {user?.role ? (
                <div>
                  <dt className="font-medium text-muted-foreground">Role</dt>
                  <dd className="mt-1 font-semibold text-foreground">{user.role}</dd>
                </div>
              ) : null}
            </dl>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Session
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {statusLabel}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Contact
                </p>
                <p className="mt-2 flex items-center gap-2 break-all text-sm font-semibold text-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  {displayEmail}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Last sync
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  Live session data
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardPageShell>
  );
}
