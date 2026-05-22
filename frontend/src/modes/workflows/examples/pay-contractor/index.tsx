import { Contractor } from "@gusto/embedded-react-sdk";
import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import { SdkBoundary } from "../../../../sdk/SdkBoundary";
import type { Example } from "../../../types";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

function Page() {
  return (
    <ExampleLayout mode="workflows" example={payContractorExample}>
      <SdkBoundary>
        <Contractor.PaymentFlow
          companyId={COMPANY_ID}
          onEvent={(eventType, eventPayload) => {
            console.log("eventType", eventType);
            console.log("eventPayload", eventPayload);
          }}
        />
      </SdkBoundary>
    </ExampleLayout>
  );
}

export const payContractorExample: Example = {
  key: "pay-contractor",
  label: "Pay a contractor",
  path: "/workflows/pay-contractor",
  summary: "Drop in the full contractor payment flow.",
  description:
    "Contractor.PaymentFlow renders the entire payment experience: choose contractors, enter amounts, review, and submit. Reach for this when you want the fastest path to paying 1099s without designing the screens yourself.",
  sdkPrimitives: ["Contractor.PaymentFlow"],
  Routes: () => (
    <Routes>
      <Route index element={<Page />} />
    </Routes>
  ),
};
