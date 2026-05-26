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

export function PayrollSettingsTaxesState({ companyUuid }: Props) {
  const { state: stateCode } = useParams<{ state: string }>();
  const navigate = useNavigate();
  const company = useCompanyState(companyUuid);
  const { toast } = useDemoToast();
  const { basePath } = useDemoSession();
  const taxesPath = `${basePath}/payroll/settings/taxes`;

  if (!stateCode) {
    return <Navigate to={taxesPath} replace />;
  }

  return (
    <>
      <Link
        to={taxesPath}
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft aria-hidden className="h-3.5 w-3.5" /> All tax settings
      </Link>
      <PageHeader
        eyebrow="Settings · Taxes"
        title={`${stateCode} state tax setup`}
        description="Enter the agency account numbers and rates required to file in this state."
      />
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <Company.StateTaxesForm
          companyId={companyUuid}
          state={stateCode}
          onEvent={(eventType) => {
            if (eventType === componentEvents.COMPANY_STATE_TAX_UPDATED) {
              toast(`${stateCode} state taxes saved`);
              company.refresh();
              navigate(taxesPath);
            }
          }}
        />
      </div>
    </>
  );
}
