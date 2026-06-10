import { CompanyOnboarding } from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../config";

// Standalone management view: the block manages its own list/edit flow
// internally, so there is nowhere to navigate on completion.
export function StateTaxes() {
  return (
    <CompanyOnboarding.StateTaxes companyId={COMPANY_ID} onEvent={() => {}} />
  );
}
