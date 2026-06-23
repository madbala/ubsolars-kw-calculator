import {
  DEFAULT_SETTINGS,
  mergeSettings,
  type AppSettings,
  type StoredSettings,
} from "./settings";

export async function fetchSharedSettings(): Promise<StoredSettings> {
  const res = await fetch("/api/settings", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch settings");
  const data = (await res.json()) as StoredSettings;
  return {
    ...mergeSettings(data),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  };
}

export async function saveSharedSettings(settings: AppSettings): Promise<StoredSettings> {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(settings),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? "Failed to save settings");
  }
  return (await res.json()) as StoredSettings;
}

export async function openAdminSession(): Promise<void> {
  await fetch("/api/admin/session", { method: "POST", credentials: "include" });
}

export async function closeAdminSession(): Promise<void> {
  await fetch("/api/admin/session", { method: "DELETE", credentials: "include" });
}
