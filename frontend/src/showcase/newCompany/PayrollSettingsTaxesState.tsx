import { Company, componentEvents } from "@gusto/embedded-react-sdk";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
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

  if (!stateCode) {
    return <Navigate to="/showcase/new-company/payroll/settings/taxes" replace />;
  }

  return (
    <>
      <Link
        to="/showcase/new-company/payroll/settings/taxes"
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← All tax settings
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
              navigate("/showcase/new-company/payroll/settings/taxes");
            }
          }}
        />
      </div>
    </>
  );
}
