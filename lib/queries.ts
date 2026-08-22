import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  AppointmentPriceRow,
  AppointmentServiceRow,
  ServiceRow,
} from "@/lib/supabase/database.types";

export const APPOINTMENT_PRICE_ID = 1;

async function safeQuery<T>(
  run: (client: ReturnType<typeof createClient>) => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isSupabaseConfigured) return fallback;

  try {
    return await run(createClient());
  } catch {
    return fallback;
  }
}

export function getServices(): Promise<ServiceRow[]> {
  return safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("country", { ascending: true });

    return data ?? [];
  }, []);
}

export function getServiceById(id: string): Promise<ServiceRow | null> {
  return safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    return data ?? null;
  }, null);
}

export function getPublishedServiceBySlug(
  slug: string
): Promise<ServiceRow | null> {
  return safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    return data ?? null;
  }, null);
}

export function getPublishedServices(): Promise<ServiceRow[]> {
  return safeQuery(async (supabase) => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("type", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }, []);
}

export function getAppointmentPrice(): Promise<AppointmentPriceRow | null> {
  return safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("appointment_price")
      .select("*")
      .eq("id", APPOINTMENT_PRICE_ID)
      .maybeSingle();

    return data ?? null;
  }, null);
}

export function getAppointmentServices(): Promise<AppointmentServiceRow[]> {
  return safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("appointment_services")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    return data ?? [];
  }, []);
}

export function getAppointmentServiceById(
  id: string
): Promise<AppointmentServiceRow | null> {
  return safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("appointment_services")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    return data ?? null;
  }, null);
}

export function getPublishedAppointmentServices(): Promise<
  AppointmentServiceRow[]
> {
  return safeQuery(async (supabase) => {
    const { data, error } = await supabase
      .from("appointment_services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }, []);
}
