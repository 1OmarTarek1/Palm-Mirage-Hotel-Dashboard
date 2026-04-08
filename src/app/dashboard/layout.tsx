"use client";

import { useEffect, useState } from "react";

import DashboardRealtimeBridge from "@/components/providers/DashboardRealtimeBridge";
import DashboardAlertsRail from "@/components/shared/alerts/DashboardAlertsRail";
import { DashboardAlertsProvider } from "@/components/shared/alerts/dashboard-alerts-context";
import Navbar from "@/components/shared/navbar/Navbar";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import { useAdminNotificationInbox } from "@/hooks/useAdminNotificationInbox";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isAlertsPanelOpen, setIsAlertsPanelOpen] = useState(false);
  const inbox = useAdminNotificationInbox();
  const refreshInbox = inbox.refresh;

  useEffect(() => {
    if (isAlertsPanelOpen) {
      void refreshInbox();
    }
  }, [isAlertsPanelOpen, refreshInbox]);

  return (
    <DashboardAlertsProvider>
      <DashboardRealtimeBridge />
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Navbar
            user={null}
            notificationCount={inbox.unreadCount}
            isAlertsPanelOpen={isAlertsPanelOpen}
            onAlertsPanelToggle={() => setIsAlertsPanelOpen((current) => !current)}
          />
          <DashboardAlertsRail
            isOpen={isAlertsPanelOpen}
            onClose={() => setIsAlertsPanelOpen(false)}
            inboxItems={inbox.items}
            inboxLoading={inbox.loading}
            inboxBusy={inbox.mutating}
            onInboxMarkRead={(id) => void inbox.markRead(id)}
            onInboxMarkAllRead={() => void inbox.markAllRead()}
            onInboxDeleteOne={(id) => void inbox.deleteOne(id)}
            onInboxClearRead={() => void inbox.clearRead()}
          />
          <div className="w-full flex-1 px-4 pb-28 pt-4 md:px-6 md:pb-8 md:pt-6 lg:px-8 lg:pt-8">
            <main className="mx-auto min-w-0 w-full max-w-[1720px]">{children}</main>
          </div>
        </div>
      </div>
    </DashboardAlertsProvider>
  );
}
