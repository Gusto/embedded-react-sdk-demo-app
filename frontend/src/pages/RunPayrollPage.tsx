import { Payroll } from "@gusto/embedded-react-sdk";
import { SdkBoundary } from "../sdk/SdkBoundary";

export function RunPayrollPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <SdkBoundary>
        <Payroll.PayrollFlow
          companyId="91b95861-9a2b-4f3e-afe7-92d57056449c"
          onEvent={(eventType, eventPayload) => {
            console.log("eventType", eventType);
            console.log("eventPayload", eventPayload);
          }}
        />
      </SdkBoundary>
    </div>
  );
}
