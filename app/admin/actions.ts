"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UNAUTHORIZED_STATE, type ActionState } from "@/lib/action-state";
import { getSession } from "@/lib/auth";
import { APPOINTMENT_PRICE_ID } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { parseAppointmentPriceForm, parseAppointmentServiceForm, parseServiceForm } from "@/lib/validation";

const DUPLICATE_SLUG_CODE = "23505";

function revalidateService(slug?: string) {
  revalidatePath("/admin/services");
  revalidatePath("/services");
  if (slug) revalidatePath(`/services/${slug}`);
}

function revalidateAppointmentServices() {
  revalidatePath("/admin/appointment-services");
  revalidatePath("/appointment");
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

  const supabase = createClient();
  const { error } = await supabase.from("services").insert(parsed.data);

  if (error) {
    if (error.code === DUPLICATE_SLUG_CODE) {
      return {
        status: "error",
        message: "A service with this title already exists.",
        fieldErrors: { title: "This title is already used by another service." },
      };
    }
    return { status: "error", message: error.message };
  }

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

  const supabase = createClient();
  const { error } = await supabase
    .from("services")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    if (error.code === DUPLICATE_SLUG_CODE) {
      return {
        status: "error",
        message: "Another service already uses this title.",
        fieldErrors: { title: "This title is already used by another service." },
      };
    }
    return { status: "error", message: error.message };
  }

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

  const supabase = createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) return { status: "error", message: error.message };

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

  const supabase = createClient();
  const { error } = await supabase
    .from("appointment_services")
    .insert(parsed.data);

  if (error) return { status: "error", message: error.message };

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

  const supabase = createClient();
  const { error } = await supabase
    .from("appointment_services")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { status: "error", message: error.message };

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

  const supabase = createClient();
  const { error } = await supabase
    .from("appointment_services")
    .delete()
    .eq("id", id);

  if (error) return { status: "error", message: error.message };

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

  const supabase = createClient();
  const { error } = await supabase
    .from("appointment_price")
    .update(parsed.data)
    .eq("id", APPOINTMENT_PRICE_ID);

  if (error) return { status: "error", message: error.message };

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

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: "Invalid email or password." };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
