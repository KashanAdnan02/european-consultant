"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubmitButton({
  isPending,
  children,
  pendingLabel = "Saving",
  variant = "primary",
  className,
}: {
  isPending: boolean;
  children: ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "danger";
  className?: string;
}) {
  const variants = {
    primary:
      "bg-swedenblue text-white hover:bg-swedenblueDark focus-visible:outline-swedenblue",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600",
  } as const;

  return (
    <button
      type="submit"
      disabled={isPending}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
    >
      {isPending && <Loader2 size={16} className="animate-spin" />}
      {isPending ? pendingLabel : children}
    </button>
  );
}
