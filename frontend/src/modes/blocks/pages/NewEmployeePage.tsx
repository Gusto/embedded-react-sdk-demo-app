import { Employee } from "@gusto/embedded-react-sdk";
import { useNavigate } from "react-router-dom";
import { SdkBoundary } from "../../../sdk/SdkBoundary";
import { useToast } from "../../../toast/ToastProvider";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

export function NewEmployeePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate("/blocks/payroll/employees")}
        className="inline-flex w-fit items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        ← Back to employees
      </button>
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <SdkBoundary>
          <Employee.Profile
            companyId={COMPANY_ID}
            onEvent={(eventType) => {
              toast({ title: String(eventType) });
            }}
          />
        </SdkBoundary>
      </div>
    </div>
  );
}
