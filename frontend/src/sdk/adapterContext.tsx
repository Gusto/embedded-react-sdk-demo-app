import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AdapterContextValue {
  adaptersEnabled: boolean;
  setAdaptersEnabled: (enabled: boolean) => void;
}

const AdapterContext = createContext<AdapterContextValue | null>(null);

export function AdapterProvider({ children }: { children: ReactNode }) {
  const [adaptersEnabled, setAdaptersEnabled] = useState(false);
  return (
    <AdapterContext.Provider value={{ adaptersEnabled, setAdaptersEnabled }}>
      {children}
    </AdapterContext.Provider>
  );
}

export function useAdapters() {
  const ctx = useContext(AdapterContext);
  if (!ctx) {
    throw new Error("useAdapters must be used inside AdapterProvider");
  }
  return ctx;
}
