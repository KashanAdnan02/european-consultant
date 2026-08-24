import { cookies } from "next/headers";
import { ADMIN_COOKIE, API_URL } from "@/lib/api-config";

type FetchOptions = Omit<RequestInit, "cache"> & {
  auth?: boolean;
  revalidate?: number | false;
};

async function parseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<{ data: T; status: number; ok: boolean }> {
  const { auth, revalidate, headers: inputHeaders, ...fetchInit } = options;
  const headers = new Headers(inputHeaders);

  if (fetchInit.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = cookies().get(ADMIN_COOKIE)?.value;
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const cacheOptions =
    revalidate === false || auth
      ? { cache: "no-store" as const }
      : { next: { revalidate: revalidate ?? 60 } };

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchInit,
    headers,
    ...cacheOptions,
  });

  return {
    data: (await parseBody(response)) as T,
    status: response.status,
    ok: response.ok,
  };
}
