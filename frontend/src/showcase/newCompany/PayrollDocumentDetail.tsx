import { Company, componentEvents } from "@gusto/embedded-react-sdk";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDemoSession } from "../DemoSession";
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
  const { basePath } = useDemoSession();
  const docsPath = `${basePath}/payroll/documents`;

  if (!formId) {
    return <Navigate to={docsPath} replace />;
  }

  return (
    <>
      <Link
        to={docsPath}
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft aria-hidden className="h-3.5 w-3.5" /> All documents
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
              navigate(docsPath);
            }
            if (eventType === componentEvents.COMPANY_SIGN_FORM_BACK) {
              navigate(docsPath);
            }
          }}
        />
      </div>
    </>
  );
}
