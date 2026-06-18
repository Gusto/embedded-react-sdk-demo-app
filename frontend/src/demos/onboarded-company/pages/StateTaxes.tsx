import { StateTaxesComposition } from "../../company-onboarding/block-compositions/StateTaxesComposition";
import { COMPANY_ID } from "../../../config";

// StateTaxes is a composite block: it has smaller sub-steps (list + per-state
// form) routed individually by the shared implementation in block-compositions/.
// It is a leaf in this demo, so there is nowhere to navigate on completion.
// Render <CompanyOnboarding.StateTaxes .../> instead for the turnkey
// single-component step.
export function StateTaxes() {
  return (
    <StateTaxesComposition
      companyId={COMPANY_ID}
      basePath="/state-taxes"
      onComplete={() => {}}
    />
  );
}
