import { Contractor } from "@gusto/embedded-react-sdk";
import { SdkBoundary } from "../../../sdk/SdkBoundary";
import { useToast } from "../../../toast/ToastProvider";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

export function ContractorsPage() {
  const { toast } = useToast();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <SdkBoundary>
        <Contractor.ContractorList
          companyId={COMPANY_ID}
          onEvent={(eventType) => {
            toast({ title: String(eventType) });
          }}
        />
      </SdkBoundary>
    </div>
  );
}
