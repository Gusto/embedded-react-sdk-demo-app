import { Contractor, componentEvents } from "@gusto/embedded-react-sdk";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDemoToast } from "../newCompany/demoToast";
import { PageHeader } from "../newCompany/ui";

interface Props {
  companyUuid: string;
}

export function PayContractorsSummary({ companyUuid }: Props) {
  const { paymentGroupId } = useParams<{ paymentGroupId: string }>();
  const navigate = useNavigate();
  const { toast } = useDemoToast();

  if (!paymentGroupId) {
    return (
      <Navigate
        to="/showcase/existing-company/payroll/pay-contractors"
        replace
      />
    );
  }

  return (
    <>
      <Link
        to="/showcase/existing-company/payroll/pay-contractors/new"
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← Back to payment details
      </Link>
      <PageHeader
        eyebrow="Pay contractors"
        title="Review and submit"
        description="Double-check before sending the payment to your contractors."
      />
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <Contractor.PaymentSummary
          companyId={companyUuid}
          paymentGroupId={paymentGroupId}
          onEvent={(eventType) => {
            if (eventType === componentEvents.CONTRACTOR_PAYMENT_SUBMIT) {
              toast("Contractor payment submitted");
              navigate(
                "/showcase/existing-company/payroll/pay-contractors",
                { replace: true }
              );
            }
            if (eventType === componentEvents.CONTRACTOR_PAYMENT_BACK_TO_EDIT) {
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
