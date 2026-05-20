import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";
import { useNavigate } from "react-router-dom";
import { SdkBoundary } from "../../../sdk/SdkBoundary";
import { useToast } from "../../../toast/ToastProvider";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

export function RunPayrollPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <SdkBoundary>
        <Payroll.PayrollList
          companyId={COMPANY_ID}
          onEvent={(eventType, eventPayload) => {
            if (eventType === componentEvents.RUN_PAYROLL_SELECTED) {
              const { payrollUuid } = eventPayload as { payrollUuid: string };
              toast({
                title: "RUN_PAYROLL_SELECTED",
                description: (
                  <>
                    Routing to{" "}
                    <code className="font-mono text-xs">
                      Payroll.PayrollConfiguration
                    </code>{" "}
                    for payroll id ={" "}
                    <span className="font-mono text-xs">{payrollUuid}</span>
                  </>
                ),
              });
              navigate(`/blocks/payroll/configuration/${payrollUuid}`);
              return;
            }
            if (eventType === componentEvents.REVIEW_PAYROLL) {
              const { payrollUuid } = eventPayload as { payrollUuid: string };
              toast({
                title: "REVIEW_PAYROLL",
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
              navigate(`/blocks/payroll/review/${payrollUuid}`);
              return;
            }
            toast({ title: String(eventType) });
          }}
        />
      </SdkBoundary>
    </div>
  );
}
