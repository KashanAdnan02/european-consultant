"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UNAUTHORIZED_STATE, type ActionState } from "@/lib/action-state";
import { apiFetch } from "@/lib/api";
import { ADMIN_COOKIE } from "@/lib/api-config";
import { getSession } from "@/lib/auth";
import {
  parseAppointmentPriceForm,
  parseAppointmentServiceForm,
  parseServiceForm,
} from "@/lib/validation";

function revalidateService(slug?: string) {
  revalidatePath("/admin/services");
  revalidatePath("/services");
  if (slug) revalidatePath(`/services/${slug}`);
}

function revalidateAppointmentServices() {
  revalidatePath("/admin/appointment-services");
  revalidatePath("/appointment");
}

function actionError(data: unknown, fallback: string): ActionState {
  const body = (data ?? {}) as {
    message?: string;
    fieldErrors?: Record<string, string>;
  };
  return {
    status: "error",
    message: body.message || fallback,
    fieldErrors: body.fieldErrors,
  };
}

export async function createServiceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session?.isAdmin) return UNAUTHORIZED_STATE;

  const parsed = parseServiceForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }

  const { data, ok } = await apiFetch("/api/admin/services", {
    method: "POST",
    auth: true,
    body: JSON.stringify(parsed.data),
  });

  if (!ok) return actionError(data, "Unable to create service.");

  revalidateService(parsed.data.slug);
  redirect("/admin/services?created=1");
}

export async function updateServiceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session?.isAdmin) return UNAUTHORIZED_STATE;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { status: "error", message: "Missing service reference." };
  }

  const parsed = parseServiceForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }

  const { data, ok } = await apiFetch(`/api/admin/services/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(parsed.data),
  });

  if (!ok) return actionError(data, "Unable to update service.");

  revalidateService(parsed.data.slug);
  redirect("/admin/services?updated=1");
}

export async function deleteServiceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session?.isAdmin) return UNAUTHORIZED_STATE;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { status: "error", message: "Missing service reference." };
  }

  const { data, ok } = await apiFetch(`/api/admin/services/${id}`, {
    method: "DELETE",
    auth: true,
  });

  if (!ok) return actionError(data, "Unable to delete service.");

  revalidateService();
  redirect("/admin/services?deleted=1");
}

export async function createAppointmentServiceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session?.isAdmin) return UNAUTHORIZED_STATE;

  const parsed = parseAppointmentServiceForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }

  const { data, ok } = await apiFetch("/api/admin/appointment-services", {
    method: "POST",
    auth: true,
    body: JSON.stringify(parsed.data),
  });

  if (!ok) return actionError(data, "Unable to create appointment office.");

  revalidateAppointmentServices();
  redirect("/admin/appointment-services?created=1");
}

export async function updateAppointmentServiceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session?.isAdmin) return UNAUTHORIZED_STATE;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { status: "error", message: "Missing appointment service reference." };
  }

  const parsed = parseAppointmentServiceForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }

  const { data, ok } = await apiFetch(`/api/admin/appointment-services/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(parsed.data),
  });

  if (!ok) return actionError(data, "Unable to update appointment office.");

  revalidateAppointmentServices();
  redirect("/admin/appointment-services?updated=1");
}

export async function deleteAppointmentServiceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session?.isAdmin) return UNAUTHORIZED_STATE;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { status: "error", message: "Missing appointment service reference." };
  }

  const { data, ok } = await apiFetch(`/api/admin/appointment-services/${id}`, {
    method: "DELETE",
    auth: true,
  });

  if (!ok) return actionError(data, "Unable to delete appointment office.");

  revalidateAppointmentServices();
  redirect("/admin/appointment-services?deleted=1");
}

export async function updateAppointmentPriceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session?.isAdmin) return UNAUTHORIZED_STATE;

  const parsed = parseAppointmentPriceForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }

  const { data, ok } = await apiFetch("/api/admin/appointment-price", {
    method: "PUT",
    auth: true,
    body: JSON.stringify(parsed.data),
  });

  if (!ok) return actionError(data, "Unable to update appointment price.");

  revalidatePath("/admin/pricing");
  revalidatePath("/admin");
  revalidatePath("/book-appointment");
  revalidatePath("/appointment");

  return { status: "success", message: "Appointment price updated." };
}

export async function signInAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { status: "error", message: "Email and password are required." };
  }

  const { data, ok } = await apiFetch<{ token?: string; message?: string }>(
    "/api/auth/login",
    {
      method: "POST",
      revalidate: false,
      body: JSON.stringify({ email, password }),
    }
  );

  if (!ok || !data?.token) {
    return {
      status: "error",
      message: data?.message || "Invalid email or password.",
    };
  }

  cookies().set(ADMIN_COOKIE, data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction() {
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
