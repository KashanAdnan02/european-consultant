"use client";

import { useCallback, useState, type FormEvent } from "react";
import { IDLE_STATE, type ActionState, type ServerAction } from "@/lib/action-state";

export function useServerAction(action: ServerAction) {
  const [state, setState] = useState<ActionState>(IDLE_STATE);
  const [isPending, setIsPending] = useState(false);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isPending) return;

      const formData = new FormData(event.currentTarget);
      setIsPending(true);

      try {
        const result = await action(IDLE_STATE, formData);
        if (result?.status) setState(result);
      } catch (error) {
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
          throw error;
        }
        setState({
          status: "error",
          message: "Something went wrong. Please try again.",
        });
      } finally {
        setIsPending(false);
      }
    },
    [action, isPending]
  );

  const reset = useCallback(() => setState(IDLE_STATE), []);

  return { state, isPending, onSubmit, reset };
}
