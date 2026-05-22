import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { SdkBoundary } from "../../../../sdk/SdkBoundary";
import { useToast } from "../../../../toast/ToastProvider";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

export function ReviewPage() {
  const { payrollUuid } = useParams<{ payrollUuid: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!payrollUuid) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate("/blocks/compose-payroll-flow")}
        className="inline-flex w-fit items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        ← Back to payroll list
      </button>
      <SdkBoundary>
        <Payroll.PayrollOverview
          companyId={COMPANY_ID}
          payrollId={payrollUuid}
          onEvent={(eventType) => {
            if (
              eventType === componentEvents.RUN_PAYROLL_EDIT ||
              eventType === componentEvents.RUN_PAYROLL_PROCESSING_FAILED
            ) {
              const eventLabel =
                eventType === componentEvents.RUN_PAYROLL_EDIT
                  ? "RUN_PAYROLL_EDIT"
                  : "RUN_PAYROLL_PROCESSING_FAILED";
              toast({
                title: eventLabel,
                description: (
                  <>
                    Routing back to{" "}
                    <code className="font-mono text-xs">
                      Payroll.PayrollConfiguration
                    </code>{" "}
                    for payroll id ={" "}
                    <span className="font-mono text-xs">{payrollUuid}</span>
                  </>
                ),
              });
              navigate(`/blocks/compose-payroll-flow/configuration/${payrollUuid}`);
              return;
            }
            toast({ title: String(eventType) });
          }}
        />
      </SdkBoundary>
    </div>
  );
}
