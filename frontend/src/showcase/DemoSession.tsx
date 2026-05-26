import { createContext, useContext, type ReactNode } from "react";

interface DemoSessionValue {
  /** Company uuid the demo is operating against. */
  companyUuid: string;
  /** Base URL the frontend uses for SDK + REST calls. Includes the
   * `/demo/<uuid>` prefix for the new-company demo (per-company tokens)
   * but is just `http://localhost:3001` for the existing-company demo
   * (default tokens.json proxy). */
  apiBaseUrl: string;
  /** Friendly brand name shown in the chrome. */
  brandName: string;
  /** Route prefix for the active demo, e.g. "/showcase/new-company" or
   * "/showcase/existing-company". Used by shared screens to build links
   * inside whichever demo the user is in. */
  basePath: string;
}

const Context = createContext<DemoSessionValue | null>(null);

export function DemoSessionProvider({
  companyUuid,
  apiBaseUrl,
  brandName,
  basePath,
  children,
}: DemoSessionValue & { children: ReactNode }) {
  return (
    <Context.Provider
      value={{ companyUuid, apiBaseUrl, brandName, basePath }}
    >
      {children}
    </Context.Provider>
  );
}

export function useDemoSession(): DemoSessionValue {
  const ctx = useContext(Context);
  if (!ctx)
    throw new Error("useDemoSession must be used inside DemoSessionProvider");
  return ctx;
}
