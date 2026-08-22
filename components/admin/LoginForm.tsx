"use client";

import { signInAction } from "@/app/admin/actions";
import { Alert, Field, TextInput } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useServerAction } from "@/components/admin/use-server-action";

export default function LoginForm({ next }: { next: string }) {
  const { state, isPending, onSubmit } = useServerAction(signInAction);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {state.status === "error" && <Alert tone="error">{state.message}</Alert>}

      <Field label="Email address" htmlFor="email" required>
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@europeanconsultant.com"
          required
        />
      </Field>

      <Field label="Password" htmlFor="password" required>
        <TextInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </Field>

      <SubmitButton
        isPending={isPending}
        pendingLabel="Signing in"
        className="w-full"
      >
        Sign in
      </SubmitButton>
    </form>
  );
}
