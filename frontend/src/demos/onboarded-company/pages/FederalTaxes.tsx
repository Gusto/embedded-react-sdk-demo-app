import { CompanyOnboarding } from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../config";

// Standalone management view for editing federal tax details.
export function FederalTaxes() {
  return (
    <CompanyOnboarding.FederalTaxes companyId={COMPANY_ID} onEvent={() => {}} />
  );
}
