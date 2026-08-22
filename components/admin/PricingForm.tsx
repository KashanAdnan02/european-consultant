"use client";

import { updateAppointmentPriceAction } from "@/app/admin/actions";
import { Alert, Card, Field, TextArea, TextInput } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useServerAction } from "@/components/admin/use-server-action";
import { PAYMENT_CURRENCIES } from "@/lib/payment";
import type { AppointmentPriceRow } from "@/lib/supabase/database.types";
import { formatDate } from "@/lib/utils";

export default function PricingForm({ price }: { price: AppointmentPriceRow }) {
  const { state, isPending, onSubmit } = useServerAction(
    updateAppointmentPriceAction
  );

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {state.status === "error" && <Alert tone="error">{state.message}</Alert>}
      {state.status === "success" && (
        <Alert tone="success">{state.message}</Alert>
      )}

      <Card
        title="Appointment fee"
        description={`Last updated ${formatDate(price.updated_at)}`}
      >
        <div className="grid gap-6 md:grid-cols-[1fr_180px]">
          <Field
            label="Amount"
            htmlFor="amount"
            required
            error={fieldErrors.amount}
            hint="Shown to visitors when they book a consultation."
          >
            <TextInput
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              defaultValue={price.amount}
              invalid={Boolean(fieldErrors.amount)}
              required
            />
          </Field>

          <Field
            label="Currency"
            htmlFor="currency"
            required
            error={fieldErrors.currency}
          >
            <TextInput
              id="currency"
              name="currency"
              list="currency-options"
              maxLength={3}
              defaultValue={price.currency}
              invalid={Boolean(fieldErrors.currency)}
              className="uppercase"
              required
            />
            <datalist id="currency-options">
              {PAYMENT_CURRENCIES.map((code) => (
                <option key={code} value={code} />
              ))}
            </datalist>
          </Field>
        </div>

        <div className="mt-6">
          <Field
            label="Note"
            htmlFor="description"
            error={fieldErrors.description}
            hint="Optional line displayed under the price, e.g. payment terms."
          >
            <TextArea
              id="description"
              name="description"
              defaultValue={price.description}
              placeholder="Consultation fee is adjusted against your service charges."
              invalid={Boolean(fieldErrors.description)}
            />
          </Field>
        </div>
      </Card>

      <SubmitButton isPending={isPending}>Update price</SubmitButton>
    </form>
  );
}
