import type { ReactNode, TextareaHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const CONTROL_BASE =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-swedenblue focus:ring-2 focus:ring-swedenblue/15 disabled:cursor-not-allowed disabled:bg-slate-50";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-ink"
      >
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-rose-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  invalid,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        CONTROL_BASE,
        invalid ? "border-rose-300 focus:border-rose-400" : "border-slate-200",
        className
      )}
    />
  );
}

export function TextArea({
  invalid,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      className={cn(
        CONTROL_BASE,
        "min-h-[104px] resize-y leading-relaxed",
        invalid ? "border-rose-300 focus:border-rose-400" : "border-slate-200",
        className
      )}
    />
  );
}

export function Select({
  invalid,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      {...props}
      className={cn(
        CONTROL_BASE,
        invalid ? "border-rose-300 focus:border-rose-400" : "border-slate-200",
        className
      )}
    >
      {children}
    </select>
  );
}

export function Alert({
  tone,
  children,
}: {
  tone: "success" | "error" | "info";
  children: ReactNode;
}) {
  const tones = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-800",
    info: "border-sky-200 bg-sky-50 text-sky-800",
  } as const;

  return (
    <div
      role="status"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm font-medium",
        tones[tone]
      )}
    >
      {children}
    </div>
  );
}

export function Card({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            {title && (
              <h2 className="text-base font-semibold text-ink">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
          {actions}
        </header>
      )}
      <div className="px-5 py-6 sm:px-6">{children}</div>
    </section>
  );
}

export function PageHeading({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {actions}
    </div>
  );
}

export function Badge({
  tone,
  children,
}: {
  tone: "success" | "neutral";
  children: ReactNode;
}) {
  const tones = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    neutral: "bg-slate-100 text-slate-600 ring-slate-500/20",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
