"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { DashboardAlert } from "@/components/dashboard/types";

interface DashboardAlertsState {
  title: string;
  description: string;
  alerts: DashboardAlert[];
}

interface DashboardAlertsContextValue {
  alertState: DashboardAlertsState;
  setAlertState: (state: DashboardAlertsState) => void;
  clearAlertState: () => void;
}

const DEFAULT_ALERT_STATE: DashboardAlertsState = {
  title: "Notifications",
  description: "Page-specific alerts will appear here.",
  alerts: [],
};

const DashboardAlertsContext = createContext<DashboardAlertsContextValue | null>(null);

function serializeAlertState(state: DashboardAlertsState | null) {
  if (!state) {
    return null;
  }

  return JSON.stringify({
    title: state.title,
    description: state.description,
    alerts: state.alerts.map((alert) => ({
      title: alert.title,
      message: alert.message,
      tone: alert.tone,
    })),
  });
}

export function DashboardAlertsProvider({ children }: { children: ReactNode }) {
  const [alertState, setAlertStateValue] = useState<DashboardAlertsState>(DEFAULT_ALERT_STATE);
  const setAlertState = useCallback((state: DashboardAlertsState) => {
    setAlertStateValue(state);
  }, []);
  const clearAlertState = useCallback(() => {
    setAlertStateValue(DEFAULT_ALERT_STATE);
  }, []);

  const value = useMemo<DashboardAlertsContextValue>(
    () => ({
      alertState,
      setAlertState,
      clearAlertState,
    }),
    [alertState, clearAlertState, setAlertState]
  );

  return (
    <DashboardAlertsContext.Provider value={value}>
      {children}
    </DashboardAlertsContext.Provider>
  );
}

export function useDashboardAlerts(config: DashboardAlertsState | null) {
  const context = useContext(DashboardAlertsContext);
  const serializedConfig = useMemo(() => serializeAlertState(config), [config]);
  const normalizedConfig = useMemo<DashboardAlertsState | null>(() => {
    if (!serializedConfig) {
      return null;
    }

    return JSON.parse(serializedConfig) as DashboardAlertsState;
  }, [serializedConfig]);
  const setAlertState = context?.setAlertState;
  const clearAlertState = context?.clearAlertState;

  useEffect(() => {
    if (!setAlertState || !clearAlertState) return;

    if (!normalizedConfig) {
      clearAlertState();
      return;
    }

    setAlertState(normalizedConfig);
  }, [clearAlertState, normalizedConfig, setAlertState]);

  useEffect(() => {
    if (!clearAlertState) return;

    return () => {
      clearAlertState();
    };
  }, [clearAlertState]);
}

export function useDashboardAlertsContext() {
  const context = useContext(DashboardAlertsContext);

  if (!context) {
    throw new Error("useDashboardAlertsContext must be used within DashboardAlertsProvider");
  }

  return context;
}
