export const API_URL =
  process.env.API_URL?.replace(/\/$/, "") || "http://localhost:4000";

export const SITE_URL =
  process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const ADMIN_COOKIE = "admin_token";

export function isApiConfigured() {
  return Boolean(API_URL);
}
