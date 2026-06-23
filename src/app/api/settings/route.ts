import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSharedSettings, writeSharedSettings } from "@/lib/settingsStore";
import { ADMIN_COOKIE_NAME, isAdminCookieSet } from "@/lib/adminAuth";
import type { AppSettings } from "@/utils/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await readSharedSettings();
    return NextResponse.json(settings, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  if (!isAdminCookieSet(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as AppSettings;
    const saved = await writeSharedSettings(body);
    return NextResponse.json(saved);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
