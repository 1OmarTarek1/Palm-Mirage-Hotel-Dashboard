"use client";

import { useEffect, useState } from "react";

import DashboardAlertsRail from "@/components/shared/alerts/DashboardAlertsRail";
import { DashboardAlertsProvider } from "@/components/shared/alerts/dashboard-alerts-context";
import Navbar from "@/components/shared/navbar/Navbar";
import Sidebar from "@/components/shared/sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isAlertsPanelOpen, setIsAlertsPanelOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    const syncAlertsPanelState = (event?: MediaQueryList | MediaQueryListEvent) => {
      const matches = "matches" in (event ?? mediaQuery) ? (event ?? mediaQuery).matches : mediaQuery.matches;
      setIsAlertsPanelOpen((current) => (matches ? current : false));
    };

    setIsAlertsPanelOpen(mediaQuery.matches);
    syncAlertsPanelState();

    const handleChange = (event: MediaQueryListEvent) => {
      syncAlertsPanelState(event);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <DashboardAlertsProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Navbar
            user={null}
            isAlertsPanelOpen={isAlertsPanelOpen}
            onAlertsPanelToggle={() => setIsAlertsPanelOpen((current) => !current)}
          />
          <div className="w-full flex-1 px-4 pb-28 pt-4 md:px-6 md:pb-8 md:pt-5 lg:px-8 lg:pt-6">
            <div
              className="mx-auto w-full max-w-[1720px] xl:grid"
              style={{
                gridTemplateColumns: isAlertsPanelOpen ? "minmax(0,1fr) 340px" : "minmax(0,1fr) 0px",
                columnGap: isAlertsPanelOpen ? "2rem" : "0rem",
                transition:
                  "grid-template-columns 320ms cubic-bezier(0.22, 1, 0.36, 1), column-gap 320ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <main className="min-w-0">{children}</main>
              <div className="hidden min-w-0 overflow-hidden xl:block">
                <DashboardAlertsRail
                  isOpen={isAlertsPanelOpen}
                  onClose={() => setIsAlertsPanelOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardAlertsProvider>
  );
}
