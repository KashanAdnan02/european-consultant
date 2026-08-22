"use client";

import Link from "next/link";
import { useState } from "react";
import { createServiceAction, updateServiceAction } from "@/app/admin/actions";
import {
  Alert,
  Card,
  Field,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useServerAction } from "@/components/admin/use-server-action";
import { SERVICE_TYPES } from "@/lib/service-types";
import type { ServiceRow } from "@/lib/supabase/database.types";
import { slugify } from "@/lib/utils";

type ServiceFormProps = {
  service?: ServiceRow;
};

const DETAIL_FIELDS = [
  {
    name: "jobs",
    label: "Jobs",
    placeholder:
      "Construction workers, warehouse workers, factory general workers",
  },
  {
    name: "salary",
    label: "Salary",
    placeholder: "Starting from 20,800 CZK (approx. 852 EUR) per month",
  },
  {
    name: "accommodation",
    label: "Accommodation",
    placeholder: "Free shared accommodation provided by the employer",
  },
  {
    name: "medical_insurance",
    label: "Medical & Insurance",
    placeholder: "Full medical insurance covered by the employer",
  },
  {
    name: "document_requirements",
    label: "Document Requirements",
    placeholder:
      "Full passport scan (all pages), police clearance certificate, full address with postal code",
  },
  {
    name: "process_time",
    label: "Process Time",
    placeholder: "30 to 60 days approximately",
  },
  {
    name: "cost",
    label: "Cost",
    placeholder: "1000 EUR — 50% advance, 50% after the work permit is issued",
  },
] as const;

export default function ServiceForm({ service }: ServiceFormProps) {
  const isEditing = Boolean(service);
  const action = isEditing ? updateServiceAction : createServiceAction;
  const { state, isPending, onSubmit } = useServerAction(action);
  const [title, setTitle] = useState(service?.title ?? service?.country ?? "");

  const fieldErrors = state.fieldErrors ?? {};
  const slug = slugify(title);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={service?.id} />}

      {state.status === "error" && <Alert tone="error">{state.message}</Alert>}

      <Card
        title="Service listing"
        description="Shown on the services page cards and grouped by type."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Title"
            htmlFor="title"
            required
            error={fieldErrors.title}
            hint='Example: "Germany Work Permit" or "Canada Tourist Visa"'
          >
            <TextInput
              id="title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Germany Work Permit"
              autoComplete="off"
              invalid={Boolean(fieldErrors.title)}
              required
            />
          </Field>

          <Field
            label="Type"
            htmlFor="type"
            required
            error={fieldErrors.type}
          >
            <Select
              id="type"
              name="type"
              defaultValue={service?.type ?? "work-permit"}
              invalid={Boolean(fieldErrors.type)}
              required
            >
              {SERVICE_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Flag"
            htmlFor="flag"
            required
            error={fieldErrors.flag}
            hint="Paste one country flag emoji"
          >
            <TextInput
              id="flag"
              name="flag"
              defaultValue={service?.flag ?? ""}
              placeholder="🇩🇪"
              maxLength={8}
              invalid={Boolean(fieldErrors.flag)}
              required
            />
          </Field>

          <Field label="Public URL" htmlFor="slug-preview">
            <TextInput
              id="slug-preview"
              value={slug ? `/services/${slug}` : "/services/…"}
              readOnly
              disabled
              className="font-mono text-xs text-slate-500"
            />
          </Field>
        </div>

        <div className="mt-6">
          <Field
            label="Short description"
            htmlFor="text"
            required
            error={fieldErrors.text}
            hint="One line shown under the title on service cards."
          >
            <TextInput
              id="text"
              name="text"
              defaultValue={service?.text ?? ""}
              placeholder="Skilled / Unskilled / Degree holders"
              invalid={Boolean(fieldErrors.text)}
              required
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Destination"
        description="The country name is used internally and on the detail page heading."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Country"
            htmlFor="country"
            required
            error={fieldErrors.country}
            hint="Example: Germany, United Kingdom, Portugal"
          >
            <TextInput
              id="country"
              name="country"
              defaultValue={service?.country ?? ""}
              placeholder="Germany"
              autoComplete="off"
              invalid={Boolean(fieldErrors.country)}
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
              Publish on the website
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Unpublished services stay saved here but are hidden from visitors.
            </span>
          </span>
        </label>
      </Card>

      <Card
        title="Service details"
        description="Everything below appears on the public service detail page."
      >
        <div className="space-y-6">
          {DETAIL_FIELDS.map((field) => (
            <Field
              key={field.name}
              label={field.label}
              htmlFor={field.name}
              required
              error={fieldErrors[field.name]}
            >
              <TextArea
                id={field.name}
                name={field.name}
                defaultValue={service?.[field.name] ?? ""}
                placeholder={field.placeholder}
                invalid={Boolean(fieldErrors[field.name])}
                required
              />
            </Field>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton isPending={isPending}>
          {isEditing ? "Save changes" : "Create service"}
        </SubmitButton>
        <Link
          href="/admin/services"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
