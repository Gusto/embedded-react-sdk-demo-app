import { useCallback, useEffect, useState } from "react";

export type DemoCompanyStatus = "loading" | "exists" | "missing" | "error";

export interface UseDemoCompany {
  status: DemoCompanyStatus;
  companyUuid: string | null;
  error?: string;
  /** Trigger creation (or reuse on the backend). Returns the uuid or null. */
  create: () => Promise<string | null>;
  creating: boolean;
  /** Forget the persisted company so the next Get Started mints a fresh
   * partner-managed company. */
  reset: () => Promise<void>;
}

interface PersistedHook {
  status: DemoCompanyStatus;
  companyUuid: string | null;
  error?: string;
}

// Module-scope cache so navigating between routes inside the demo doesn't
// re-fetch (and doesn't re-trigger the loading state on every mount).
let cache: PersistedHook | null = null;
const subscribers = new Set<(next: PersistedHook) => void>();

function setCache(next: PersistedHook) {
  cache = next;
  for (const fn of subscribers) fn(next);
}

async function fetchCurrent(): Promise<PersistedHook> {
  try {
    const response = await fetch(
      "http://localhost:3001/api/demo/new-company/current"
    );
    if (response.status === 404) {
      return { status: "missing", companyUuid: null };
    }
    if (!response.ok) {
      return {
        status: "error",
        companyUuid: null,
        error: `Backend returned ${response.status}`,
      };
    }
    const data = (await response.json()) as { companyUuid: string };
    return { status: "exists", companyUuid: data.companyUuid };
  } catch (error) {
    return {
      status: "error",
      companyUuid: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function useDemoCompany(): UseDemoCompany {
  const [state, setState] = useState<PersistedHook>(
    () => cache ?? { status: "loading", companyUuid: null }
  );
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    subscribers.add(setState);
    if (!cache) {
      fetchCurrent().then(setCache);
    }
    return () => {
      subscribers.delete(setState);
    };
  }, []);

  const create = useCallback(async (): Promise<string | null> => {
    setCreating(true);
    try {
      const response = await fetch(
        "http://localhost:3001/api/demo/new-company",
        { method: "POST" }
      );
      if (!response.ok) {
        const text = await response.text();
        setCache({
          status: "error",
          companyUuid: null,
          error: `Backend returned ${response.status}: ${text}`,
        });
        return null;
      }
      const data = (await response.json()) as { companyUuid: string };
      setCache({ status: "exists", companyUuid: data.companyUuid });
      return data.companyUuid;
    } catch (error) {
      setCache({
        status: "error",
        companyUuid: null,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    } finally {
      setCreating(false);
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      await fetch("http://localhost:3001/api/demo/new-company", {
        method: "DELETE",
      });
    } catch {
      // Best effort — clear the local cache regardless so the UI
      // returns to the Get Started view.
    }
    setCache({ status: "missing", companyUuid: null });
  }, []);

  return {
    status: state.status,
    companyUuid: state.companyUuid,
    error: state.error,
    create,
    creating,
    reset,
  };
}
