const ADMIN_TAB_SESSION = "ubsolars-admin-tab-unlocked";

let memoryUnlocked = false;

function sessionStorageWorks(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = "__ubsolars_probe__";
    sessionStorage.setItem(probe, "1");
    sessionStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function isAdminTabUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  if (!sessionStorageWorks()) return memoryUnlocked;
  try {
    return sessionStorage.getItem(ADMIN_TAB_SESSION) === "1";
  } catch {
    return memoryUnlocked;
  }
}

export function setAdminTabUnlocked(unlocked: boolean): void {
  memoryUnlocked = unlocked;
  if (typeof window === "undefined" || !sessionStorageWorks()) return;
  try {
    if (unlocked) sessionStorage.setItem(ADMIN_TAB_SESSION, "1");
    else sessionStorage.removeItem(ADMIN_TAB_SESSION);
  } catch {
    // Fall back to in-memory state for this tab session.
  }
}
