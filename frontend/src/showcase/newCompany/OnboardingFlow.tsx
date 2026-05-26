import { Company, componentEvents } from "@gusto/embedded-react-sdk";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { DemoSpinner } from "../DemoSpinner";
import { EmployeesStep } from "./EmployeesStep";

type StepKey =
  | "locations"
  | "federalTaxes"
  | "industry"
  | "bankAccount"
  | "paySchedule"
  | "employees"
  | "stateTaxes";

interface StepDef {
  key: StepKey;
  label: string;
  /** Steps the user can finish without producing a "done" event we care
   * about. Marking a step optional lets the user click "Skip" or just
   * navigate away without blocking the rest of the flow. */
  optional?: boolean;
}

const ORDERED_STEPS: StepDef[] = [
  { key: "locations", label: "Addresses" },
  { key: "federalTaxes", label: "Federal tax" },
  { key: "industry", label: "Industry" },
  { key: "bankAccount", label: "Bank account" },
  { key: "paySchedule", label: "Pay schedule" },
  { key: "employees", label: "Employees", optional: true },
  { key: "stateTaxes", label: "State taxes" },
];

const API_STEP_TO_LOCAL: Record<string, StepKey> = {
  add_addresses: "locations",
  federal_tax_setup: "federalTaxes",
  select_industry: "industry",
  add_bank_info: "bankAccount",
  payroll_schedule: "paySchedule",
  add_employees: "employees",
  state_setup: "stateTaxes",
};

interface Bootstrap {
  initialStep: StepKey;
  completed: Set<StepKey>;
  employeesAdded: boolean;
}

interface OnboardingFlowProps {
  companyUuid: string;
  onComplete: () => void;
}

export function OnboardingFlow({
  companyUuid,
  onComplete,
}: OnboardingFlowProps) {
  const [bootstrap, setBootstrap] = useState<Bootstrap | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(
          `http://localhost:3001/demo/${companyUuid}/v1/companies/${companyUuid}/onboarding_status`
        );
        const data = response.ok
          ? ((await response.json()) as {
              onboarding_steps?: Array<{ id?: string; completed?: boolean }>;
            })
          : { onboarding_steps: [] };
        const completed = new Set<StepKey>();
        for (const step of data.onboarding_steps ?? []) {
          if (step.completed && step.id && API_STEP_TO_LOCAL[step.id]) {
            completed.add(API_STEP_TO_LOCAL[step.id]);
          }
        }
        const initialStep =
          ORDERED_STEPS.find((s) => !completed.has(s.key))?.key ?? "locations";
        if (!cancelled) {
          setBootstrap({
            initialStep,
            completed,
            employeesAdded: completed.has("employees"),
          });
        }
      } catch {
        if (!cancelled) {
          setBootstrap({
            initialStep: "locations",
            completed: new Set(),
            employeesAdded: false,
          });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [companyUuid]);

  if (!bootstrap) {
    return <DemoSpinner />;
  }

  return (
    <FlowInner
      key={bootstrap.initialStep}
      companyUuid={companyUuid}
      onComplete={onComplete}
      initialBootstrap={bootstrap}
    />
  );
}

function FlowInner({
  companyUuid,
  onComplete,
  initialBootstrap,
}: OnboardingFlowProps & { initialBootstrap: Bootstrap }) {
  const [stepKey, setStepKey] = useState<StepKey>(initialBootstrap.initialStep);
  const [completed, setCompleted] = useState<Set<StepKey>>(
    initialBootstrap.completed
  );
  const [employeesAdded, setEmployeesAdded] = useState(
    initialBootstrap.employeesAdded
  );

  const visibleSteps = ORDERED_STEPS.filter((s) =>
    s.key === "stateTaxes" ? employeesAdded : true
  );

  function markCompleted(key: StepKey) {
    setCompleted((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }

  function advance(from: StepKey) {
    markCompleted(from);
    const i = visibleSteps.findIndex((s) => s.key === from);
    const next = visibleSteps[i + 1];
    if (next) setStepKey(next.key);
    else onComplete();
  }

  function goTo(key: StepKey) {
    setStepKey(key);
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <StepNav
        visibleSteps={visibleSteps}
        current={stepKey}
        completed={completed}
        onSelect={goTo}
      />
      {stepKey === "locations" ? (
        <Company.Locations
          companyId={companyUuid}
          onEvent={(eventType) => {
            if (eventType === componentEvents.COMPANY_LOCATION_DONE) {
              advance("locations");
            }
          }}
        />
      ) : null}
      {stepKey === "federalTaxes" ? (
        <Company.FederalTaxes
          companyId={companyUuid}
          onEvent={(eventType) => {
            if (eventType === componentEvents.COMPANY_FEDERAL_TAXES_DONE) {
              advance("federalTaxes");
            }
          }}
        />
      ) : null}
      {stepKey === "industry" ? (
        <Company.Industry
          companyId={companyUuid}
          onEvent={(eventType) => {
            if (eventType === componentEvents.COMPANY_INDUSTRY_SELECTED) {
              advance("industry");
            }
          }}
        />
      ) : null}
      {stepKey === "bankAccount" ? (
        <Company.BankAccount
          companyId={companyUuid}
          onEvent={(eventType) => {
            if (eventType === componentEvents.COMPANY_BANK_ACCOUNT_DONE) {
              advance("bankAccount");
            }
          }}
        />
      ) : null}
      {stepKey === "paySchedule" ? (
        <Company.PaySchedule
          companyId={companyUuid}
          onEvent={(eventType) => {
            if (eventType === componentEvents.PAY_SCHEDULE_DONE) {
              advance("paySchedule");
            }
          }}
        />
      ) : null}
      {stepKey === "employees" ? (
        <EmployeesStep
          companyUuid={companyUuid}
          onSkip={() => {
            markCompleted("employees");
            onComplete();
          }}
          onCompleted={(addedAny) => {
            setEmployeesAdded(addedAny);
            markCompleted("employees");
            if (addedAny) {
              const next = ORDERED_STEPS.find((s) => s.key === "stateTaxes");
              if (next) setStepKey(next.key);
              else onComplete();
            } else {
              onComplete();
            }
          }}
        />
      ) : null}
      {stepKey === "stateTaxes" ? (
        <Company.StateTaxes
          companyId={companyUuid}
          onEvent={(eventType) => {
            if (eventType === componentEvents.COMPANY_STATE_TAX_DONE) {
              markCompleted("stateTaxes");
              onComplete();
            }
          }}
        />
      ) : null}
    </div>
  );
}

function StepNav({
  visibleSteps,
  current,
  completed,
  onSelect,
}: {
  visibleSteps: StepDef[];
  current: StepKey;
  completed: Set<StepKey>;
  onSelect: (key: StepKey) => void;
}) {
  const currentIdx = visibleSteps.findIndex((s) => s.key === current);
  const currentLabel = visibleSteps[currentIdx]?.label ?? "";

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Step {currentIdx + 1} of {visibleSteps.length} · {currentLabel}
      </p>
      <div className="flex flex-wrap gap-2">
        {visibleSteps.map((step) => {
          const isCurrent = step.key === current;
          const isCompleted = completed.has(step.key);
          const isClickable = isCurrent || isCompleted;
          return (
            <button
              key={step.key}
              type="button"
              disabled={!isClickable}
              onClick={() => onSelect(step.key)}
              className={[
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
                isCurrent
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : isCompleted
                    ? "cursor-pointer border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                    : "cursor-not-allowed border-neutral-100 bg-white text-neutral-400",
              ].join(" ")}
            >
              {isCompleted && !isCurrent ? (
                <Check
                  aria-hidden
                  className="h-3.5 w-3.5 text-emerald-500"
                  strokeWidth={3}
                />
              ) : null}
              {step.label}
           
            </button>
          );
        })}
      </div>
    </div>
  );
}
