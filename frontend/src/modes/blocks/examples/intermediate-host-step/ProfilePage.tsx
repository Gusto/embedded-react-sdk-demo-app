import { Employee, componentEvents } from "@gusto/embedded-react-sdk";
import { useNavigate } from "react-router-dom";
import { SdkBoundary } from "../../../../sdk/SdkBoundary";
import { useToast } from "../../../../toast/ToastProvider";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

export function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <p className="m-0 text-sm text-neutral-600 dark:text-neutral-400">
        Step 1 of 3 — capture the employee's profile via the SDK. When the
        block emits its done event we'll route to a host-owned step that
        collects data unique to <em>your</em> system.
      </p>
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <SdkBoundary>
          <Employee.Profile
            companyId={COMPANY_ID}
            onEvent={(eventType, eventPayload) => {
              if (eventType === componentEvents.EMPLOYEE_PROFILE_DONE) {
                // EMPLOYEE_PROFILE_DONE emits the Employee object — the id
                // we want is on `uuid` (Gusto's standard identifier), not
                // `employeeId`.
                const payload = eventPayload as { uuid?: string };
                if (!payload.uuid) return;
                toast({
                  title: "EMPLOYEE_PROFILE_DONE",
                  description: (
                    <>
                      Routing to a host-owned step for employee id ={" "}
                      <span className="font-mono text-xs">{payload.uuid}</span>
                    </>
                  ),
                });
                navigate(
                  `/blocks/intermediate-host-step/extra-data/${payload.uuid}`
                );
                return;
              }
              toast({ title: String(eventType) });
            }}
          />
        </SdkBoundary>
      </div>
    </div>
  );
}
