import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDemoCompany } from "./useDemoCompany";

const NEW_COMPANY_API_BASE = "http://localhost:3001";

/**
 * Required onboarding steps that must be complete before we hand the user
 * off to the dashboard. Pay schedule, bank verification, and employee
 * setup are explicitly *not* required here — those become dashboard
 * action items.
 */
const REQUIRED_STEPS = [
  "add_addresses",
  "federal_tax_setup",
  "select_industry",
  "add_bank_info",
] as const;

type Destination = "start" | "onboarding" | "dashboard";

interface OnboardingStep {
  id?: string;
  completed?: boolean;
}

export function Gate() {
  const { status, companyUuid } = useDemoCompany();
  const [destination, setDestination] = useState<Destination | "loading">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;
    async function decide() {
      if (status === "loading") return;
      if (status === "missing" || status === "error" || !companyUuid) {
        if (!cancelled) setDestination("start");
        return;
      }
      try {
        const response = await fetch(
          `${NEW_COMPANY_API_BASE}/demo/${companyUuid}/v1/companies/${companyUuid}/onboarding_status`
        );
        if (!response.ok) {
          if (!cancelled) setDestination("onboarding");
          return;
        }
        const data = (await response.json()) as {
          onboarding_steps?: OnboardingStep[];
        };
        const steps = data.onboarding_steps ?? [];
        const allRequiredDone = REQUIRED_STEPS.every((id) =>
          steps.find((s) => s.id === id && s.completed === true)
        );
        if (!cancelled) {
          setDestination(allRequiredDone ? "dashboard" : "onboarding");
        }
      } catch {
        if (!cancelled) setDestination("onboarding");
      }
    }
    decide();
    return () => {
      cancelled = true;
    };
  }, [status, companyUuid]);

  if (destination === "loading") {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="m-0 text-sm text-neutral-500">Loading demo…</p>
      </div>
    );
  }

  return <Navigate to={destination} replace />;
}
