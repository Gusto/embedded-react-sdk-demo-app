import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { SdkBoundary } from "../../../../sdk/SdkBoundary";
import { useToast } from "../../../../toast/ToastProvider";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

export function ConfigurationPage() {
  const { payrollId } = useParams<{ payrollId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!payrollId) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate("/blocks/custom-list-from-api")}
        className="inline-flex w-fit items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        <ArrowLeft aria-hidden className="h-3.5 w-3.5" /> Back to custom list
      </button>
      <SdkBoundary>
        <Payroll.PayrollConfiguration
          companyId={COMPANY_ID}
          payrollId={payrollId}
          onEvent={(eventType) => {
            if (eventType === componentEvents.RUN_PAYROLL_CALCULATED) {
              toast({
                title: "RUN_PAYROLL_CALCULATED",
                description: (
                  <>
                    Payroll calculated for id ={" "}
                    <span className="font-mono text-xs">{payrollId}</span>
                  </>
                ),
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
