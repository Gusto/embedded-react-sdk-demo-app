import { CompanyOnboarding } from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../config";

// Standalone management view: the block manages its own view/edit/verify flow
// internally, so there is nowhere to navigate on completion.
export function BankAccount() {
  return (
    <CompanyOnboarding.BankAccount companyId={COMPANY_ID} onEvent={() => {}} />
  );
}
