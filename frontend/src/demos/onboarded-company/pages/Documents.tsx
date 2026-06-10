import { CompanyOnboarding } from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../config";

// Standalone management view: the block manages its own document list/signing
// flow internally, so there is nowhere to navigate on completion.
export function Documents() {
  return (
    <CompanyOnboarding.DocumentSigner companyId={COMPANY_ID} onEvent={() => {}} />
  );
}
