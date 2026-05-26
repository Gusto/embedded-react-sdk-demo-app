import { Employee } from "@gusto/embedded-react-sdk";
import { useState } from "react";
import { FeatureLayout } from "../featureLayout";
import { FeaturePreview } from "../FeaturePreview";
import type { Feature } from "../types";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

const defaults = {
  employee: {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@analytical-engine.example",
  },
  homeAddress: {
    street1: "10 Bishopsgate",
    city: "London",
    state: "NY",
    zip: "10001",
  },
};

const snippet = `import { GustoProvider, Employee } from "@gusto/embedded-react-sdk";

// Many SDK components accept a \`defaultValues\` prop that pre-fills
// the form with values you already have on file (from your own CRM,
// HRIS, sign-up flow, anywhere). The SDK still owns validation,
// submission, and the API call — you just get to skip the part where
// the user re-types data you already collected.
<Employee.Profile
  companyId={COMPANY_ID}
  defaultValues={{
    employee: {
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@analytical-engine.example",
    },
    homeAddress: {
      street1: "10 Bishopsgate",
      city: "London",
      state: "NY",
      zip: "10001",
    },
  }}
  onEvent={...}
/>;
`;

function Page() {
  const [enabled, setEnabled] = useState(true);

  const controls = (
    <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          Pre-fill from your data
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {enabled
            ? "Form is pre-populated with values we already have on file."
            : "Form starts empty — the user types everything from scratch."}
        </span>
      </div>
      <label className="flex cursor-pointer items-center gap-2 select-none">
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          {enabled ? "On" : "Off"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
            enabled
              ? "bg-blue-500 dark:bg-[#E15A43]"
              : "bg-neutral-300 dark:bg-neutral-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-4.5" : "translate-x-0.5"
            }`}
          />
        </button>
      </label>
    </div>
  );

  return (
    <FeatureLayout
      eyebrow="Feature"
      title="Bring your own data"
      summary="Pre-fill SDK forms with data you already have so users don't re-type information you collected somewhere else."
      description={
        <>
          <p className="m-0">
            Most SDK components that render a form accept a{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">
              defaultValues
            </code>{" "}
            prop. Pass the values you already know — pulled from your sign-up
            flow, an existing CRM record, or a CSV import — and the SDK uses
            them as the form's starting state. The user can review, edit, and
            then submit, but they don't have to start from a blank screen.
          </p>
          <p className="m-0">
            The SDK still owns validation, the submit handler, and the API
            call. <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">defaultValues</code>{" "}
            only changes what the form is pre-populated with — everything
            downstream behaves exactly the same as a stock SDK form.
          </p>
        </>
      }
      previewControls={controls}
      code={[{ name: "Employee.Profile.tsx", source: snippet }]}
    >
      <FeaturePreview>
        <Employee.Profile
          key={enabled ? "with-defaults" : "empty"}
          companyId={COMPANY_ID}
          defaultValues={enabled ? defaults : undefined}
          onEvent={(eventType, eventPayload) => {
            console.log(eventType, eventPayload);
          }}
        />
      </FeaturePreview>
    </FeatureLayout>
  );
}

export const bringYourOwnDataFeature: Feature = {
  key: "bring-your-own-data",
  label: "Bring your own data",
  path: "/features/bring-your-own-data",
  summary:
    "Pre-fill SDK forms with data you already have on file via the defaultValues prop.",
  Page,
};
