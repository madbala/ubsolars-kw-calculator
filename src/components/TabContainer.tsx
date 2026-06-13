"use client";

import { useState } from "react";
import BillCalculatorTab from "./BillCalculatorTab";
import UnitsCalculatorTab from "./UnitsCalculatorTab";
import KwSimulatorTab from "./KwSimulatorTab";
import { tabBar, tabBtnClass } from "@/lib/ui";

const TABS = [
  { id: "bill", label: "By bill", shortLabel: "Bill" },
  { id: "units", label: "By units", shortLabel: "Units" },
  { id: "simulate", label: "Try kW sizes", shortLabel: "kW sizes" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TabContainer() {
  const [active, setActive] = useState<TabId>("bill");

  return (
    <div>
      <div className={`mb-4 sm:mb-6 ${tabBar} grid-cols-3`}>
        {TABS.map((tab) => (
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
    </div>
  );
}
