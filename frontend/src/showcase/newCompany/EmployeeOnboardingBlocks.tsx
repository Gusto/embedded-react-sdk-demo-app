import { Employee, componentEvents } from "@gusto/embedded-react-sdk";
import { useState } from "react";

type EmployeeStep =
  | "profile"
  | "compensation"
  | "federalTaxes"
  | "stateTaxes"
  | "paymentMethod";

const ORDER: EmployeeStep[] = [
  "profile",
  "compensation",
  "federalTaxes",
  "stateTaxes",
  "paymentMethod",
];

const LABELS: Record<EmployeeStep, string> = {
  profile: "Profile",
  compensation: "Compensation",
  federalTaxes: "Federal taxes",
  stateTaxes: "State taxes",
  paymentMethod: "Payment method",
};

interface Props {
  companyUuid: string;
  /** When provided, skip Profile and resume the rest of onboarding for
   * an existing employee. */
  initialEmployeeId?: string;
  onDone: () => void;
}

/**
 * Employee onboarding composed from individual SDK blocks. The host owns
 * the step order and transitions — each block's "done" event drives the
 * next step.
 */
export function EmployeeOnboardingBlocks({
  companyUuid,
  initialEmployeeId,
  onDone,
}: Props) {
  const [step, setStep] = useState<EmployeeStep>(
    initialEmployeeId ? "compensation" : "profile"
  );
  const [employeeId, setEmployeeId] = useState<string | null>(
    initialEmployeeId ?? null
  );

  function next() {
    const i = ORDER.indexOf(step);
    if (i < ORDER.length - 1) setStep(ORDER[i + 1]);
    else onDone();
  }

  return (
    <div className="flex flex-col gap-6">
      <StepRail visibleSteps={ORDER} current={step} />
      {step === "profile" ? (
        <Employee.Profile
          companyId={companyUuid}
          isAdmin
          onEvent={(eventType, payload) => {
            if (eventType === componentEvents.EMPLOYEE_PROFILE_DONE) {
              const data = payload as { uuid?: string } | undefined;
              if (data?.uuid) setEmployeeId(data.uuid);
              next();
            }
          }}
        />
      ) : null}
      {employeeId && step === "compensation" ? (
        <Employee.Compensation
          employeeId={employeeId}
          startDate={new Date().toISOString().slice(0, 10)}
          onEvent={(eventType) => {
            if (eventType === componentEvents.EMPLOYEE_COMPENSATION_DONE) next();
          }}
        />
      ) : null}
      {employeeId && step === "federalTaxes" ? (
        <Employee.FederalTaxes
          employeeId={employeeId}
          onEvent={(eventType) => {
            // The public Employee.FederalTaxes is the *management* block,
            // which emits _UPDATED on save (no _DONE). Treat _UPDATED as
            // our cue to advance.
            if (eventType === componentEvents.EMPLOYEE_FEDERAL_TAXES_UPDATED) {
              next();
            }
          }}
        />
      ) : null}
      {employeeId && step === "stateTaxes" ? (
        <Employee.StateTaxes
          employeeId={employeeId}
          onEvent={(eventType) => {
            if (eventType === componentEvents.EMPLOYEE_STATE_TAXES_UPDATED) {
              next();
            }
          }}
        />
      ) : null}
      {employeeId && step === "paymentMethod" ? (
        <Employee.PaymentMethod
          employeeId={employeeId}
          onEvent={(eventType) => {
            if (eventType === componentEvents.EMPLOYEE_PAYMENT_METHOD_DONE) {
              next();
            }
          }}
        />
      ) : null}
    </div>
  );
}

function StepRail({
  visibleSteps,
  current,
}: {
  visibleSteps: EmployeeStep[];
  current: EmployeeStep;
}) {
  const idx = visibleSteps.indexOf(current);
  return (
    <div className="flex flex-col gap-2">
      <p className="m-0 text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Onboarding {LABELS[current]} · Step {idx + 1} of {visibleSteps.length}
      </p>
      <div className="flex h-1 gap-1">
        {visibleSteps.map((s, i) => (
          <div
            key={s}
            className={`h-full flex-1 rounded-full ${
              i <= idx
                ? "bg-linear-to-br from-indigo-500 to-fuchsia-500"
                : "bg-neutral-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
