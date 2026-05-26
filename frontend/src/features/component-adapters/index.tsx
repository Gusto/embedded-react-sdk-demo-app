import { Payroll } from "@gusto/embedded-react-sdk";
import { useState } from "react";
import { FeatureLayout } from "../featureLayout";
import { FeaturePreview } from "../FeaturePreview";
import { adapters } from "../../sdk/adapters";
import type { Feature } from "../types";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

const snippet = `import { GustoProvider, Employee } from "@gusto/embedded-react-sdk";
import { adapters } from "./your-adapters";

// Pass your styled adapter set to GustoProvider's \`components\` prop.
// Every Gusto SDK component will now render its inputs, buttons,
// alerts, badges, etc. through your design system instead of the
// SDK's defaults.
<GustoProvider
  config={{ baseUrl: "..." }}
  components={adapters}
>
  <Employee.Profile companyId={COMPANY_ID} onEvent={...} />
</GustoProvider>;
`;

function Page() {
  const [adaptersEnabled, setAdaptersEnabled] = useState(true);

  const controls = (
    <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          Component adapters
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {adaptersEnabled
            ? "Rendering with the demo's styled adapter set."
            : "Rendering with the SDK's default components."}
        </span>
      </div>
      <label className="flex cursor-pointer items-center gap-2 select-none">
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          {adaptersEnabled ? "On" : "Off"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={adaptersEnabled}
          onClick={() => setAdaptersEnabled(!adaptersEnabled)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
            adaptersEnabled
              ? "bg-blue-500 dark:bg-[#E15A43]"
              : "bg-neutral-300 dark:bg-neutral-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              adaptersEnabled ? "translate-x-4.5" : "translate-x-0.5"
            }`}
          />
        </button>
      </label>
    </div>
  );

  return (
    <FeatureLayout
      eyebrow="Feature"
      title="Component adapters"
      summary="Swap the SDK's default UI primitives — buttons, inputs, selects, alerts — for your own components."
      description={
        <>
          <p className="m-0">
            Every Gusto SDK component renders through a small set of UI
            primitives (TextInput, Button, Select, RadioGroup, Alert, and so
            on). Passing an <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">adapters</code>{" "}
            object to <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">GustoProvider</code>'s{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">components</code> prop
            replaces those primitives with your own implementations. The SDK's
            data wiring, validation, and event model are untouched — only the
            visual rendering changes.
          </p>
          <p className="m-0">
            Use the toggle below to flip between the SDK's defaults and this
            demo's adapter set. Notice that the same{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">Employee.Profile</code>{" "}
            component renders identical fields and behavior either way — only
            the look changes.
          </p>
        </>
      }
      previewControls={controls}
      code={[{ name: "GustoProvider.tsx", source: snippet }]}
    >
      <FeaturePreview components={adaptersEnabled ? adapters : undefined}>
        <Payroll.PayrollList
          companyId={COMPANY_ID}
          onEvent={(eventType, eventPayload) => {
            console.log(eventType, eventPayload);
          }}
        />
      </FeaturePreview>
    </FeatureLayout>
  );
}

export const componentAdaptersFeature: Feature = {
  key: "component-adapters",
  label: "Component adapters",
  path: "/features/component-adapters",
  summary:
    "Swap the SDK's default inputs and buttons for your own design system components.",
  Page,
};
