import { useCallback, useMemo, useState, type ReactNode } from "react";
import { createPersistedStore } from "../../shared/persistedStore";
import {
  AdapterContext,
  type AdapterContextValue,
  type AdapterId,
} from "./context";
import { adapters } from "./registry";

const store = createPersistedStore<AdapterId>("demo:adapter:");
const STORE_ID = "v1";
const DEFAULT_ID: AdapterId = "default";

function isKnownAdapter(id: string | null): id is AdapterId {
  return id != null && adapters.some((a) => a.id === id);
}

interface AdapterStateProviderProps {
  children: ReactNode;
}

// Holds the selected component adapter and persists it across refreshes. In a
// real integration you would simply pass a fixed `components` map to
// GustoProvider; the runtime switcher exists only to demo multiple adapters.
export function AdapterStateProvider({ children }: AdapterStateProviderProps) {
  const [selectedId, setSelectedId] = useState<AdapterId>(() => {
    const stored = store.load(STORE_ID);
    return isKnownAdapter(stored) ? stored : DEFAULT_ID;
  });

  const select = useCallback((id: AdapterId) => {
    setSelectedId(id);
    store.save(STORE_ID, id);
  }, []);

  const components = useMemo(
    () => adapters.find((a) => a.id === selectedId)?.components,
    [selectedId],
  );

  const value = useMemo<AdapterContextValue>(
    () => ({ adapters, selectedId, select, components }),
    [selectedId, select, components],
  );

  return (
    <AdapterContext.Provider value={value}>{children}</AdapterContext.Provider>
  );
}
