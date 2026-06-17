import { LocationsComposition } from "../../company-onboarding/block-compositions/LocationsComposition";
import { COMPANY_ID } from "../../../config";

// Locations is a composite block: it has smaller sub-steps (list + form) routed
// individually by the shared implementation in block-compositions/. It is a leaf
// in this demo, so there is nowhere to navigate on completion. Render
// <CompanyOnboarding.Locations .../> instead for the turnkey single-component
// step.
export function Locations() {
  return (
    <LocationsComposition
      companyId={COMPANY_ID}
      basePath="/locations"
      onComplete={() => {}}
    />
  );
}
