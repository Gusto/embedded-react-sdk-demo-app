import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../newCompany/ui";

interface Props {
  companyUuid: string;
}

export function PayrollRunConfiguration({ companyUuid }: Props) {
  const { payrollUuid } = useParams<{ payrollUuid: string }>();
  const navigate = useNavigate();

  if (!payrollUuid) {
    return (
      <Navigate
        to="/showcase/existing-company/payroll/pay-employees"
        replace
      />
    );
  }

  return (
    <>
      <Link
        to="/showcase/existing-company/payroll/pay-employees"
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft aria-hidden className="h-3.5 w-3.5" /> Back to upcoming payrolls
      </Link>
      <PageHeader
        eyebrow="Run payroll"
        title="Configure payroll"
        description="Review hours, earnings, and adjustments for each employee before calculating."
      />
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <Payroll.PayrollConfiguration
          companyId={companyUuid}
          payrollId={payrollUuid}
          onEvent={(eventType) => {
            if (eventType === componentEvents.RUN_PAYROLL_CALCULATED) {
              navigate(
                `/showcase/existing-company/payroll/pay-employees/${payrollUuid}/summary`,
                { replace: true }
              );
            }
          }}
        />
      </div>
    </>
  );
}
