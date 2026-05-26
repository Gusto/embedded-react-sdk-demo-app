import { GustoProvider } from "@gusto/embedded-react-sdk";
import { type ReactNode } from "react";
import { adapters } from "../sdk/adapters";
import { useAdapters } from "../sdk/adapterContext";

// The SDK's typed theme doesn't include `colorBodyHover` even though
// its stylesheet reads it. Drop the strict object literal check by
// declaring this as a plain const.
const demoTheme = {
  colorBodyHover: "#f5f5f5",
  fontFamily: '"Google Sans", sans-serif',
};

interface DemoSdkBoundaryProps {
  /** UUID of the demo company whose tokens the backend will use. */
  companyUuid: string;
  children: ReactNode;
}

/**
 * SDK provider for showcase demos. The proxy is keyed by company uuid so
 * each demo run hits its own credentials without leaking through the
 * default tokens.json refresh token used by the rest of the app.
 *
 * Demos always render in light mode with the SDK's default palette to
 * match the "real product" feel of the showcase shell. Component
 * adapters are wired up to the shared AdapterContext so the toggle in
 * the demo top bar swaps between SDK defaults and the Hatchwell-styled
 * adapter set.
 */
export function DemoSdkBoundary({
  companyUuid,
  children,
}: DemoSdkBoundaryProps) {
  const { adaptersEnabled } = useAdapters();
  return (
    <GustoProvider
      config={{ baseUrl: `http://localhost:3001/demo/${companyUuid}` }}
      components={adaptersEnabled ? adapters : undefined}
      theme={demoTheme}
    >
      {children}
    </GustoProvider>
  );
}
