import { Contractor } from "@gusto/embedded-react-sdk";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

export function PayContractorsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Contractor.PaymentFlow
        companyId={COMPANY_ID}
        onEvent={(eventType, eventPayload) => {
          console.log("eventType", eventType);
          console.log("eventPayload", eventPayload);
        }}
      />
    </div>
  );
}
