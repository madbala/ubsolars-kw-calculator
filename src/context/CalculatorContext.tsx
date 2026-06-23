"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_SETTINGS, type AppSettings } from "@/utils/settings";
import { fetchSharedSettings, saveSharedSettings } from "@/utils/settingsClient";

type CalculatorContextValue = {
  panelWatts: number;
  setPanelWatts: (w: number) => void;
  settings: AppSettings;
  updateSettings: (next: AppSettings) => Promise<void>;
};

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [panelWatts, setPanelWatts] = useState(550);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetchSharedSettings()
      .then((remote) => setSettings(remote))
      .catch(() => setSettings(DEFAULT_SETTINGS));
  }, []);

  const updateSettings = useCallback(async (next: AppSettings) => {
    const saved = await saveSharedSettings(next);
    setSettings(saved);
  }, []);

  const value = useMemo(
    () => ({ panelWatts, setPanelWatts, settings, updateSettings }),
    [panelWatts, settings, updateSettings],
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
