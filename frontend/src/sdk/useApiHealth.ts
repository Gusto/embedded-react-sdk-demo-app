import { useEffect, useState } from "react";

export interface ApiHealth {
  state: "loading" | "ok" | "not-configured" | "unreachable";
  reason?: string;
}

let cached: ApiHealth | null = null;
let inflight: Promise<ApiHealth> | null = null;

async function fetchHealth(): Promise<ApiHealth> {
  try {
    const response = await fetch("http://localhost:3001/health");
    if (!response.ok) {
      return { state: "unreachable", reason: `Backend returned ${response.status}.` };
    }
    const data = (await response.json()) as { ok: boolean; reason?: string };
    return data.ok
      ? { state: "ok" }
      : { state: "not-configured", reason: data.reason };
  } catch (error) {
    return {
      state: "unreachable",
      reason:
        error instanceof Error ? error.message : "Could not reach the backend.",
    };
  }
}

export function useApiHealth(): ApiHealth {
  const [health, setHealth] = useState<ApiHealth>(
    () => cached ?? { state: "loading" }
  );

  useEffect(() => {
    if (cached) return;
    if (!inflight) inflight = fetchHealth();
    let active = true;
    inflight.then((result) => {
      cached = result;
      if (active) setHealth(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return health;
}
