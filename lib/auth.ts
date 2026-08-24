import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { ADMIN_COOKIE } from "@/lib/api-config";
import type { AdminSession } from "@/lib/types";

export type { AdminSession };

export async function getSession(): Promise<AdminSession | null> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  try {
    const { data, ok } = await apiFetch<AdminSession>("/api/auth/me", {
      auth: true,
      revalidate: false,
    });
    return ok ? data : null;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await requireSession();
  if (!session.isAdmin) redirect("/admin/no-access");
  return session;
}
