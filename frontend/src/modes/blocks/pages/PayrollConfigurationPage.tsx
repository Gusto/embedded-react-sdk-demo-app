import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { SdkBoundary } from "../../../sdk/SdkBoundary";
import { useToast } from "../../../toast/ToastProvider";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

export function PayrollConfigurationPage() {
  const { payrollUuid } = useParams<{ payrollUuid: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!payrollUuid) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate("/blocks/payroll/run")}
        className="inline-flex w-fit items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        ← Back to payroll list
      </button>
      <SdkBoundary>
        <Payroll.PayrollConfiguration
          companyId={COMPANY_ID}
          payrollId={payrollUuid}
          onEvent={(eventType) => {
            if (eventType === componentEvents.RUN_PAYROLL_CALCULATED) {
              toast({
                title: "RUN_PAYROLL_CALCULATED",
                description: (
                  <>
                    Routing to{" "}
                    <code className="font-mono text-xs">
                      Payroll.PayrollOverview
                    </code>{" "}
                    for payroll id ={" "}
                    <span className="font-mono text-xs">{payrollUuid}</span>
                  </>
                ),
              });
              navigate(`/blocks/payroll/review/${payrollUuid}`, {
                replace: true,
              });
              return;
            }
            toast({ title: String(eventType) });
          }}
        />
      </SdkBoundary>
    </div>
  );
}
