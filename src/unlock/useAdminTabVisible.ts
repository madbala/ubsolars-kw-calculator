"use client";

import { useAdminGate } from "./AdminGateContext";

/** @deprecated Prefer useAdminGate — kept for unlock module API compatibility */
export function useAdminTabVisible() {
  const { visible, ready, unlock, lock, goToAdminTick } = useAdminGate();
  return { visible, ready, unlock, lock, goToAdminTick };
}
