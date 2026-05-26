import { Contractor, componentEvents } from "@gusto/embedded-react-sdk";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../newCompany/ui";

interface Props {
  companyUuid: string;
}

export function PayrollPayContractors({ companyUuid }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        eyebrow="Payroll"
        title="Pay contractors"
        description="Manage 1099 payments. Start a new payment run or review past payments."
        action={
          <Link
            to="new"
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-indigo-500/40"
          >
            New payment
          </Link>
        }
      />
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <Contractor.PaymentsList
          companyId={companyUuid}
          onEvent={(eventType) => {
            if (eventType === componentEvents.CONTRACTOR_PAYMENT_CREATE) {
              navigate(
                "/showcase/existing-company/payroll/pay-contractors/new"
              );
            }
          }}
        />
      </div>
    </>
  );
}
