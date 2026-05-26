import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../newCompany/ui";

interface Props {
  companyUuid: string;
}

export function PayrollRunSummary({ companyUuid }: Props) {
  const { payrollUuid } = useParams<{ payrollUuid: string }>();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  if (!payrollUuid) {
    return (
      <Navigate
        to="/showcase/existing-company/payroll/pay-employees"
        replace
      />
    );
  }

  const backTo = submitted
    ? "/showcase/existing-company/payroll/pay-employees"
    : `/showcase/existing-company/payroll/pay-employees/${payrollUuid}/configuration`;
  const backLabel = submitted
    ? "Back to upcoming payrolls"
    : "Back to configuration";

  return (
    <>
      <Link
        to={backTo}
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft aria-hidden className="h-3.5 w-3.5" /> {backLabel}
      </Link>
      <PageHeader
        eyebrow="Run payroll"
        title="Review and submit"
        description="Double-check totals, then submit to send payroll for processing."
      />
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <Payroll.PayrollOverview
          companyId={companyUuid}
          payrollId={payrollUuid}
          onEvent={(eventType) => {
            if (eventType === componentEvents.RUN_PAYROLL_SUBMITTED) {
              setSubmitted(true);
            }
            if (
              eventType === componentEvents.RUN_PAYROLL_EDIT ||
              eventType === componentEvents.RUN_PAYROLL_PROCESSING_FAILED
            ) {
              navigate(
                `/showcase/existing-company/payroll/pay-employees/${payrollUuid}/configuration`,
                { replace: true }
              );
            }
          }}
        />
      </div>
    </>
  );
}
