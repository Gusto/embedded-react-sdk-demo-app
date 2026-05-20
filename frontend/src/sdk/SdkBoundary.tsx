import { GustoProvider } from "@gusto/embedded-react-sdk";
import { type ReactNode } from "react";
import { adapters } from "./adapters";
import { useAdapters } from "./adapterContext";

interface SdkBoundaryProps {
  children: ReactNode;
}

export function SdkBoundary({ children }: SdkBoundaryProps) {
  const { adaptersEnabled } = useAdapters();
  return (
    <GustoProvider
      config={{ baseUrl: "http://localhost:3001" }}
      components={adaptersEnabled ? adapters : undefined}
    >
      {children}
    </GustoProvider>
  );
}
