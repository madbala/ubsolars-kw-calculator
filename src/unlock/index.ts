/**
 * UNLOCK MODULE — isolated admin-tab gate
 * ----------------------------------------
 * To remove this feature entirely, say "DELETE UNLOCK" and delete:
 *   - this folder (src/unlock/)
 *   - imports from TabContainer.tsx and page.tsx
 * Then restore the admin tab as always visible in TabContainer.
 */

export { isAdminTabUnlocked, setAdminTabUnlocked } from "./adminUnlockSession";
export { AdminGateProvider, useAdminGate } from "./AdminGateContext";
export { default as AdminFab } from "./AdminFab";
export { default as AdminUnlockModal } from "./AdminUnlockModal";
export { useAdminTabVisible } from "./useAdminTabVisible";
