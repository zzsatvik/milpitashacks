import { createClient } from "@insforge/sdk";

const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL;
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

export function isInsforgeConfigured(): boolean {
  return Boolean(baseUrl && anonKey);
}

export const insforge = isInsforgeConfigured()
  ? createClient({ baseUrl: baseUrl!, anonKey: anonKey! })
  : null;

export type InsforgeUser = NonNullable<
  Awaited<ReturnType<NonNullable<typeof insforge>["auth"]["getCurrentUser"]>>["data"]
>["user"];
