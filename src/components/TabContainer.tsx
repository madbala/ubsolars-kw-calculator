"use client";

import { useEffect, useMemo, useState } from "react";
import BillCalculatorTab from "./BillCalculatorTab";
import UnitsCalculatorTab from "./UnitsCalculatorTab";
import KwSimulatorTab from "./KwSimulatorTab";
import AdminDashboard from "./AdminDashboard";
import PanelWattsInput from "./PanelWattsInput";
import { tabBar, tabBtnClass } from "@/lib/ui";
import { useAdminTabVisible } from "@/unlock";

const PUBLIC_TABS = [
  { id: "bill", label: "By bill", shortLabel: "Bill" },
  { id: "units", label: "By units", shortLabel: "Units" },
  { id: "simulate", label: "Try kW sizes", shortLabel: "kW sizes" },
] as const;

const ADMIN_TAB = { id: "admin", label: "Dashboard", shortLabel: "Admin" } as const;

type PublicTabId = (typeof PUBLIC_TABS)[number]["id"];
type TabId = PublicTabId | typeof ADMIN_TAB.id;

export default function TabContainer() {
  const { visible: adminVisible, ready, goToAdminTick } = useAdminTabVisible();
  const [active, setActive] = useState<TabId>("bill");

  const tabs = useMemo(
    () => (adminVisible ? [...PUBLIC_TABS, ADMIN_TAB] : [...PUBLIC_TABS]),
    [adminVisible],
  );

  useEffect(() => {
    if (ready && active === "admin" && !adminVisible) {
      setActive("bill");
    }
  }, [ready, active, adminVisible]);

  useEffect(() => {
    if (goToAdminTick > 0 && adminVisible) {
      setActive("admin");
    }
  }, [goToAdminTick, adminVisible]);

  const gridCols =
    tabs.length === 4 ? "grid-cols-4" : "grid-cols-3";

  return (
    <div>
      <PanelWattsInput />

      <div className={`mb-4 sm:mb-6 ${tabBar} ${gridCols}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={tabBtnClass(active === tab.id)}
          >
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {active === "bill" && <BillCalculatorTab />}
      {active === "units" && <UnitsCalculatorTab />}
      {active === "simulate" && <KwSimulatorTab />}
      {active === "admin" && adminVisible && <AdminDashboard />}
    </div>
  );
}
