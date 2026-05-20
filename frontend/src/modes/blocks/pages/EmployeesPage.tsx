import { Employee, componentEvents } from "@gusto/embedded-react-sdk";
import { useNavigate } from "react-router-dom";
import { SdkBoundary } from "../../../sdk/SdkBoundary";
import { useToast } from "../../../toast/ToastProvider";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

export function EmployeesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <SdkBoundary>
        <Employee.EmployeeList
          companyId={COMPANY_ID}
          onEvent={(eventType, eventPayload) => {
            if (eventType === componentEvents.EMPLOYEE_CREATE) {
              toast({
                title: "EMPLOYEE_CREATE",
                description: (
                  <>
                    Routing to{" "}
                    <code className="font-mono text-xs">Employee.Profile</code>{" "}
                    for a new employee
                  </>
                ),
              });
              navigate("/blocks/payroll/employees/new");
              return;
            }
            if (eventType === componentEvents.EMPLOYEE_UPDATE) {
              const { employeeId } = eventPayload as { employeeId: string };
              toast({
                title: "EMPLOYEE_UPDATE",
                description: (
                  <>
                    Routing to{" "}
                    <code className="font-mono text-xs">Employee.Profile</code>{" "}
                    for employee id ={" "}
                    <span className="font-mono text-xs">{employeeId}</span>
                  </>
                ),
              });
              navigate(`/blocks/payroll/employees/${employeeId}`);
              return;
            }
            toast({ title: String(eventType) });
          }}
        />
      </SdkBoundary>
    </div>
  );
}
