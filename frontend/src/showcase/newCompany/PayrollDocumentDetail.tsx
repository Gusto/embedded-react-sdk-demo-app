import { Company, componentEvents } from "@gusto/embedded-react-sdk";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useCompanyState } from "./useCompanyState";
import { useDemoToast } from "./demoToast";
import { PageHeader } from "./ui";

interface Props {
  companyUuid: string;
}

export function PayrollDocumentDetail({ companyUuid }: Props) {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const state = useCompanyState(companyUuid);
  const { toast } = useDemoToast();

  if (!formId) {
    return <Navigate to="/showcase/new-company/payroll/documents" replace />;
  }

  return (
    <>
      <Link
        to="/showcase/new-company/payroll/documents"
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← All documents
      </Link>
      <PageHeader
        eyebrow="Sign document"
        title="Review and sign"
        description="Sign the form below to confirm authorization."
      />
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <Company.SignatureForm
          companyId={companyUuid}
          formId={formId}
          onEvent={(eventType) => {
            if (eventType === componentEvents.COMPANY_SIGN_FORM_DONE) {
              toast("Document signed");
              state.refresh();
              navigate("/showcase/new-company/payroll/documents");
            }
            if (eventType === componentEvents.COMPANY_SIGN_FORM_BACK) {
              navigate("/showcase/new-company/payroll/documents");
            }
          }}
        />
      </div>
    </>
  );
}
