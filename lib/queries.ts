import { apiFetch } from "@/lib/api";
import type {
  AppointmentPriceRow,
  AppointmentServiceRow,
  ServiceRow,
} from "@/lib/types";

export const APPOINTMENT_PRICE_ID = 1;

export async function getServices(): Promise<ServiceRow[]> {
  try {
    const { data, ok } = await apiFetch<ServiceRow[]>("/api/admin/services", {
      auth: true,
    });
    return ok && Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getServiceById(id: string): Promise<ServiceRow | null> {
  try {
    const { data, ok } = await apiFetch<ServiceRow | null>(
      `/api/admin/services/${id}`,
      { auth: true }
    );
    return ok ? data : null;
  } catch {
    return null;
  }
}

export async function getPublishedServiceBySlug(
  slug: string
): Promise<ServiceRow | null> {
  try {
    const { data, ok } = await apiFetch<ServiceRow | null>(
      `/api/public/services/${encodeURIComponent(slug)}`
    );
    return ok ? data : null;
  } catch {
    return null;
  }
}

export async function getPublishedServices(): Promise<ServiceRow[]> {
  try {
    const { data, ok } = await apiFetch<ServiceRow[]>("/api/public/services");
    return ok && Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getAppointmentPrice(): Promise<AppointmentPriceRow | null> {
  try {
    const { data, ok } = await apiFetch<AppointmentPriceRow | null>(
      "/api/public/appointment-price"
    );
    return ok ? data : null;
  } catch {
    return null;
  }
}

export async function getAppointmentServices(): Promise<AppointmentServiceRow[]> {
  try {
    const { data, ok } = await apiFetch<AppointmentServiceRow[]>(
      "/api/admin/appointment-services",
      { auth: true }
    );
    return ok && Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getAppointmentServiceById(
  id: string
): Promise<AppointmentServiceRow | null> {
  try {
    const { data, ok } = await apiFetch<AppointmentServiceRow | null>(
      `/api/admin/appointment-services/${id}`,
      { auth: true }
    );
    return ok ? data : null;
  } catch {
    return null;
  }
}

export async function getPublishedAppointmentServices(): Promise<
  AppointmentServiceRow[]
> {
  try {
    const { data, ok } = await apiFetch<AppointmentServiceRow[]>(
      "/api/public/appointment-services"
    );
    return ok && Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getApiHealth(): Promise<boolean> {
  try {
    const { ok } = await apiFetch<{ ok: boolean }>("/api/health", {
      revalidate: false,
    });
    return ok;
  } catch {
    return false;
  }
}
