import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminSession = {
  userId: string;
  email: string;
  isAdmin: boolean;
};

export async function getSession(): Promise<AdminSession | null> {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    return {
      userId: user.id,
      email: user.email ?? "",
      isAdmin: Boolean(admin),
    };
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
