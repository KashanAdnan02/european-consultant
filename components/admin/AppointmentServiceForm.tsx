"use client";

import Link from "next/link";
import {
  createAppointmentServiceAction,
  updateAppointmentServiceAction,
} from "@/app/admin/actions";
import {
  Alert,
  Card,
  Field,
  TextArea,
  TextInput,
} from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useServerAction } from "@/components/admin/use-server-action";
import type { AppointmentServiceRow } from "@/lib/supabase/database.types";

type AppointmentServiceFormProps = {
  service?: AppointmentServiceRow;
};

export default function AppointmentServiceForm({
  service,
}: AppointmentServiceFormProps) {
  const isEditing = Boolean(service);
  const action = isEditing
    ? updateAppointmentServiceAction
    : createAppointmentServiceAction;
  const { state, isPending, onSubmit } = useServerAction(action);
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={service?.id} />}

      {state.status === "error" && <Alert tone="error">{state.message}</Alert>}

      <Card
        title="Appointment office"
        description="Shown as a card on the public /appointment page."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Name"
            htmlFor="name"
            required
            error={fieldErrors.name}
            hint='Example: "Portugal Visa Appointment Office"'
          >
            <TextInput
              id="name"
              name="name"
              defaultValue={service?.name ?? ""}
              placeholder="Portugal Visa Appointment Office"
              autoComplete="off"
              invalid={Boolean(fieldErrors.name)}
              required
            />
          </Field>

          <Field
            label="Sort order"
            htmlFor="sort_order"
            error={fieldErrors.sort_order}
            hint="Lower numbers appear first."
          >
            <TextInput
              id="sort_order"
              name="sort_order"
              type="number"
              min={0}
              max={10000}
              step={1}
              defaultValue={service?.sort_order ?? 0}
              invalid={Boolean(fieldErrors.sort_order)}
            />
          </Field>
        </div>

        <div className="mt-6">
          <Field
            label="Flag image"
            htmlFor="flag_image"
            required
            error={fieldErrors.flag_image}
            hint="Use a public path like /images/portugal.webp or a full https image URL."
          >
            <TextInput
              id="flag_image"
              name="flag_image"
              defaultValue={service?.flag_image ?? ""}
              placeholder="/images/portugal.webp"
              autoComplete="off"
              invalid={Boolean(fieldErrors.flag_image)}
              required
            />
          </Field>
        </div>

        <div className="mt-6">
          <Field
            label="Short description"
            htmlFor="description"
            required
            error={fieldErrors.description}
            hint="Shown under the office name on the appointment cards."
          >
            <TextArea
              id="description"
              name="description"
              defaultValue={service?.description ?? ""}
              placeholder="We provide professional visa appointment assistance for this office."
              invalid={Boolean(fieldErrors.description)}
              required
            />
          </Field>
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={service?.is_published ?? true}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-swedenblue focus:ring-swedenblue"
          />
          <span>
            <span className="block text-sm font-semibold text-ink">
              Publish on the appointment page
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Unpublished offices stay saved here but are hidden from visitors.
            </span>
          </span>
        </label>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton isPending={isPending}>
          {isEditing ? "Save changes" : "Create appointment service"}
        </SubmitButton>
        <Link
          href="/admin/appointment-services"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
