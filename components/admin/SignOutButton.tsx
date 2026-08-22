"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const VARIANTS = {
  sidebar:
    "w-full text-slate-300 hover:bg-white/10 hover:text-white justify-start",
  outline:
    "w-full justify-center border border-slate-200 text-slate-700 hover:bg-slate-50",
} as const;

export default function SignOutButton({
  variant = "sidebar",
}: {
  variant?: keyof typeof VARIANTS;
}) {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        setIsPending(true);
        void signOutAction();
      }}
      className={cn(
        "inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition disabled:opacity-60",
        VARIANTS[variant]
      )}
    >
      <LogOut size={18} />
      {isPending ? "Signing out" : "Sign out"}
    </button>
  );
}
