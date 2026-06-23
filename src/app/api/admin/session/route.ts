import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isAdminCookieSet } from "@/lib/adminAuth";

const MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const cookieStore = await cookies();
  return NextResponse.json({
    authenticated: isAdminCookieSet(cookieStore.get(ADMIN_COOKIE_NAME)?.value),
  });
}
