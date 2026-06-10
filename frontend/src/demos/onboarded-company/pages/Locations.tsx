import { CompanyOnboarding } from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../config";

// Standalone management view: the block manages its own list/edit flow
// internally, so there is nowhere to navigate on completion.
export function Locations() {
  return (
    <CompanyOnboarding.Locations companyId={COMPANY_ID} onEvent={() => {}} />
  );
}
