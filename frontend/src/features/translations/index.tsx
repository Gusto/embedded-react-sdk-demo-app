import { Employee } from "@gusto/embedded-react-sdk";
import { FeatureLayout } from "../featureLayout";
import { FeaturePreview } from "../FeaturePreview";
import type { Feature } from "../types";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

const customDictionary = {
  en: {
    "Employee.Profile": {
      title: "Team member",
      description:
        "We need a few details to get this person into the system. They'll receive an email invite once you save.",
      firstName: "Given name",
      middleInitial: "Middle initial",
      lastName: "Family name",
      email: "Work email",
      emailDescription:
        "This is where we'll send their onboarding invite.",
      startDateLabel: "Day one",
      startDateDescription: "First day on the job — be specific!",
      workAddress: "Where they work",
      workAddressDescription: "The office or site they'll report to.",
      submitCta: "Add teammate",
    },
  },
};

const snippet = `import { GustoProvider, Employee } from "@gusto/embedded-react-sdk";

// Pass a \`dictionary\` to GustoProvider to override any of the SDK's
// translation keys. Provide just the keys you want to change — anything
// you omit falls back to the SDK's defaults.
const dictionary = {
  en: {
    "Employee.Profile": {
      title: "Team member",
      description:
        "We need a few details to get this person into the system. They'll receive an email invite once you save.",
      firstName: "Given name",
      middleInitial: "Middle initial",
      lastName: "Family name",
      email: "Work email",
      emailDescription: "This is where we'll send their onboarding invite.",
      startDateLabel: "Day one",
      startDateDescription: "First day on the job — be specific!",
      workAddress: "Where they work",
      workAddressDescription: "The office or site they'll report to.",
      submitCta: "Add teammate",
    },
  },
};

<GustoProvider
  config={{ baseUrl: "..." }}
  dictionary={dictionary}
>
  <Employee.Profile companyId={COMPANY_ID} isAdmin onEvent={...} />
</GustoProvider>;
`;

function Page() {
  const controls = (
    <div className="flex flex-col gap-1 rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 dark:border-[#E15A43]/30 dark:bg-[#E15A43]/5">
      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        Rendering with custom translations
      </span>
      <span className="text-xs text-neutral-600 dark:text-neutral-400">
        Field labels, descriptions, and the submit button below all come
        from the dictionary in the Code tab — compare to the same{" "}
        <code className="rounded bg-white/60 px-1 font-mono text-[11px] dark:bg-black/30">
          Employee.Profile
        </code>{" "}
        on the other feature pages to see the difference.
      </span>
    </div>
  );

  return (
    <FeatureLayout
      eyebrow="Feature"
      title="Translations"
      summary="Override any SDK string — field labels, descriptions, button copy, validation messages — without forking components."
      description={
        <>
          <p className="m-0">
            Every piece of copy the SDK renders comes from an i18n dictionary
            keyed by component name. Pass a{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">
              dictionary
            </code>{" "}
            prop to{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">
              GustoProvider
            </code>{" "}
            with just the keys you want to override — the SDK deep-merges your
            overrides on top of its defaults, so anything you omit keeps its
            built-in copy.
          </p>
          <p className="m-0">
            This is the same hook you'd use to localize into another language,
            tweak microcopy to match your product's voice, or rename a field
            (e.g. "Email" → "Work email") so it fits your customers'
            vocabulary.
          </p>
        </>
      }
      previewControls={controls}
      code={[{ name: "GustoProvider.tsx", source: snippet }]}
    >
      <FeaturePreview dictionary={customDictionary}>
        <Employee.Profile
          companyId={COMPANY_ID}
          isAdmin
          onEvent={(eventType, eventPayload) => {
            console.log(eventType, eventPayload);
          }}
        />
      </FeaturePreview>
    </FeatureLayout>
  );
}

export const translationsFeature: Feature = {
  key: "translations",
  label: "Translations",
  path: "/features/translations",
  summary:
    "Override SDK copy and field labels by passing a partial dictionary to GustoProvider.",
  Page,
};
