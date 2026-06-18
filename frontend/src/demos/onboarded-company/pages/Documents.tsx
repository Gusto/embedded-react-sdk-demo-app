import { CompanyDocumentSignerComposition } from "../../company-onboarding/block-compositions/CompanyDocumentSignerComposition";
import { COMPANY_ID } from "../../../config";

// DocumentSigner is a composite block: it has smaller sub-steps (document list +
// assign signatory + signature form) routed individually by the shared
// implementation in block-compositions/. It is a leaf in this demo, so there is
// nowhere to navigate on completion. Render <CompanyOnboarding.DocumentSigner .../>
// instead for the turnkey single-component step.
export function Documents() {
  return (
    <CompanyDocumentSignerComposition
      companyId={COMPANY_ID}
      basePath="/documents"
      onComplete={() => {}}
    />
  );
}
