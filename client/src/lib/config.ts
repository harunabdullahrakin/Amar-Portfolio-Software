import { ConfigType } from "@/types";

export async function getConfig(): Promise<ConfigType> {
  const response = await fetch("/api/config");
  if (!response.ok) {
    throw new Error("Failed to load configuration");
  }
  return response.json();
}
