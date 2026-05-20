import { Payroll } from "@gusto/embedded-react-sdk";

export function Nav1Page() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <Payroll.PayrollFlow
        companyId="91b95861-9a2b-4f3e-afe7-92d57056449c" // Replace with your company ID
        onEvent={(eventType, eventPayload) => {
          console.log("eventType", eventType);
          console.log("eventPayload", eventPayload);
        }}
      />
    </div>
  );
}
