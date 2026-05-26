import { GustoProvider } from "@gusto/embedded-react-sdk";
import { type ReactNode } from "react";
import { adapters } from "../../sdk/adapters";
import { useAdapters } from "../../sdk/adapterContext";

interface Props {
  apiBaseUrl: string;
  children: ReactNode;
}

// The SDK's typed theme doesn't include `colorBodyHover`, so declare the
// theme object as a plain const to bypass excess-property checking.
const demoTheme = {
  colorBodyHover: "#f5f5f5",
  fontFamily: '"Google Sans", sans-serif',
};

/**
 * SDK boundary for the existing-company demo. Uses the default proxy
 * (tokens.json) and respects the shared adapter toggle in the top bar.
 */
export function ExistingCompanySdkBoundary({ apiBaseUrl, children }: Props) {
  const { adaptersEnabled } = useAdapters();
  return (
    <GustoProvider
      config={{ baseUrl: apiBaseUrl }}
      components={adaptersEnabled ? adapters : undefined}
      theme={demoTheme}
    >
      {children}
    </GustoProvider>
  );
}
