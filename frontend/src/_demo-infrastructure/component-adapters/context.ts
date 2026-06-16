import type { ComponentsContextType } from "@gusto/embedded-react-sdk";
import { createContext, useContext } from "react";

// A component adapter swaps the UI primitives the SDK renders. The "default"
// adapter supplies no components, so the SDK falls back to its built-in React
// Aria implementations; other adapters supply a (partial) component map that is
// passed straight to GustoProvider's `components` prop.
export type AdapterId = "default" | "material-ui";

export interface AdapterOption {
  id: AdapterId;
  label: string;
  description: string;
  /** Component map handed to GustoProvider. Omitted for the SDK default. */
  components?: Partial<ComponentsContextType>;
}

export interface AdapterContextValue {
  adapters: AdapterOption[];
  selectedId: AdapterId;
  select: (id: AdapterId) => void;
  /** Components for the selected adapter, or undefined for the SDK default. */
  components?: Partial<ComponentsContextType>;
}

export const AdapterContext = createContext<AdapterContextValue | null>(null);

export function useAdapters(): AdapterContextValue {
  const ctx = useContext(AdapterContext);
  if (!ctx) {
    throw new Error("useAdapters must be used within an AdapterStateProvider");
  }
  return ctx;
}

/** Returns the component map to pass to GustoProvider's `components` prop. */
export function useAdapterComponents(): Partial<ComponentsContextType> | undefined {
  return useAdapters().components;
}
