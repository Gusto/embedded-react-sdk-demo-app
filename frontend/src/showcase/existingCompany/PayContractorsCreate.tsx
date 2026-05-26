import { Contractor, componentEvents } from "@gusto/embedded-react-sdk";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../newCompany/ui";

interface Props {
  companyUuid: string;
}

export function PayContractorsCreate({ companyUuid }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <Link
        to="/showcase/existing-company/payroll/pay-contractors"
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← Back to contractor payments
      </Link>
      <PageHeader
        eyebrow="Pay contractors"
        title="New contractor payment"
        description="Choose contractors and enter amounts, then preview before submitting."
      />
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <Contractor.CreatePayment
          companyId={companyUuid}
          onEvent={(eventType, payload) => {
            if (eventType === componentEvents.CONTRACTOR_PAYMENT_CREATED) {
              const data = payload as
                | { paymentGroupId?: string; payment_group_id?: string }
                | undefined;
              const id = data?.paymentGroupId ?? data?.payment_group_id;
              if (id) {
                navigate(
                  `/showcase/existing-company/payroll/pay-contractors/${id}/summary`,
                  { replace: true }
                );
              }
            }
            if (eventType === componentEvents.CONTRACTOR_PAYMENT_CANCEL) {
              navigate(
                "/showcase/existing-company/payroll/pay-contractors"
              );
            }
          }}
        />
      </div>
    </>
  );
}
