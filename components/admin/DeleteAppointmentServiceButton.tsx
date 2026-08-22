"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteAppointmentServiceAction } from "@/app/admin/actions";
import { Alert } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useServerAction } from "@/components/admin/use-server-action";

export default function DeleteAppointmentServiceButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { state, isPending, onSubmit, reset } = useServerAction(
    deleteAppointmentServiceAction
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    reset();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Delete ${name}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
      >
        <Trash2 size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-appointment-service-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="delete-appointment-service-title"
              className="text-lg font-semibold text-ink"
            >
              Delete {name}?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              This permanently removes the office from the appointment page.
              This action cannot be undone.
            </p>

            {state.status === "error" && (
              <div className="mt-4">
                <Alert tone="error">{state.message}</Alert>
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 flex justify-end gap-3">
              <input type="hidden" name="id" value={id} />
              <button
                type="button"
                onClick={close}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <SubmitButton
                isPending={isPending}
                variant="danger"
                pendingLabel="Deleting"
              >
                Delete office
              </SubmitButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
