import { GustoProvider } from "@gusto/embedded-react-sdk";
import { type ReactNode } from "react";

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
 * match the "real product" feel of the showcase shell.
 */
export function DemoSdkBoundary({
  companyUuid,
  children,
}: DemoSdkBoundaryProps) {
  return (
    <GustoProvider
      config={{ baseUrl: `http://localhost:3001/demo/${companyUuid}` }}
      theme={{ colorBodyHover: "#f5f5f5" }}
    >
      {children}
    </GustoProvider>
  );
}
