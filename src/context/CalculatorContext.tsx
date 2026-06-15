"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type AppSettings,
} from "@/utils/settings";

type CalculatorContextValue = {
  panelWatts: number;
  setPanelWatts: (w: number) => void;
  settings: AppSettings;
  updateSettings: (next: AppSettings) => void;
  refreshSettings: () => void;
};

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [panelWatts, setPanelWatts] = useState(550);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const refreshSettings = useCallback(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const updateSettings = useCallback((next: AppSettings) => {
    saveSettings(next);
    setSettings(next);
  }, []);

  const value = useMemo(
    () => ({
      panelWatts,
      setPanelWatts,
      settings,
      updateSettings,
      refreshSettings,
    }),
    [panelWatts, settings, updateSettings, refreshSettings],
  );

  return (
    <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used within CalculatorProvider");
  return ctx;
}
