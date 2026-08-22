import type { FieldErrors } from "@/lib/validation";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: FieldErrors;
};

export type ServerAction = (
  prevState: ActionState,
  formData: FormData
) => Promise<ActionState>;

export const IDLE_STATE: ActionState = { status: "idle", message: "" };

export const UNAUTHORIZED_STATE: ActionState = {
  status: "error",
  message: "You do not have permission to perform this action.",
};
