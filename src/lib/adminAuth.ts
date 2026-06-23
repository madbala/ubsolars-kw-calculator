export const ADMIN_COOKIE_NAME = "ubsolars-admin";

export function isAdminCookieSet(cookieValue: string | undefined): boolean {
  return cookieValue === "1";
}
