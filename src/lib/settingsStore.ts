import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { get, put } from "@vercel/blob";
import { DEFAULT_SETTINGS, mergeSettings, type AppSettings } from "@/utils/settings";

export type StoredSettings = AppSettings & { updatedAt: string };

const BLOB_PATH = "ubsolars-app-settings.json";
const DATA_FILE = path.join(process.cwd(), "data", "app-settings.json");

function toStored(partial: Partial<StoredSettings>, updatedAt: string): StoredSettings {
  return { ...mergeSettings(partial), updatedAt };
}

function useBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readFromFile(): Promise<StoredSettings | null> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<StoredSettings>;
    return toStored(parsed, parsed.updatedAt ?? new Date().toISOString());
  } catch {
    return null;
  }
}

async function readFromBlob(): Promise<StoredSettings | null> {
  if (!useBlob()) return null;
  try {
    const result = await get(BLOB_PATH, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const parsed = JSON.parse(await new Response(result.stream).text()) as Partial<StoredSettings>;
    return toStored(parsed, parsed.updatedAt ?? new Date().toISOString());
  } catch {
    return null;
  }
}

async function writeToFile(stored: StoredSettings): Promise<void> {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(stored, null, 2), "utf-8");
}

async function writeToBlob(stored: StoredSettings): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(stored, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

export async function readSharedSettings(): Promise<StoredSettings> {
  const fromBlob = await readFromBlob();
  if (fromBlob) return fromBlob;

  const fromFile = await readFromFile();
  if (fromFile) return fromFile;

  return toStored(DEFAULT_SETTINGS, new Date().toISOString());
}

export async function writeSharedSettings(settings: AppSettings): Promise<StoredSettings> {
  const stored: StoredSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  if (useBlob()) {
    await writeToBlob(stored);
    return stored;
  }

  await writeToFile(stored);
  return stored;
}
