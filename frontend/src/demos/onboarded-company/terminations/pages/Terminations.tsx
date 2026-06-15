import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  EmployeeManagement,
  Payroll,
  componentEvents,
} from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../../config";
import styles from "./Terminations.module.css";

// Mirrors the SDK's PayrollOption (Employee/types); swap to the exported type
// once it's surfaced on the EmployeeManagement barrel.
const PAYROLL_OPTIONS = ["dismissalPayroll", "regularPayroll", "anotherWay"] as const;
type PayrollOption = (typeof PAYROLL_OPTIONS)[number];

function parsePayrollOption(value: string | null): PayrollOption | undefined {
  return PAYROLL_OPTIONS.find((option) => option === value);
}

export function TerminateForm() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <>
      <Link to="/employees" className={styles.backLink}>
        <span aria-hidden="true">&larr;</span>Back to employees
      </Link>
      <EmployeeManagement.TerminateEmployee
        companyId={COMPANY_ID}
        employeeId={employeeId!}
        onEvent={(type, payload) => {
          switch (type) {
            case componentEvents.EMPLOYEE_TERMINATION_DONE: {
              const { payrollOption, payrollUuid } = payload as {
                payrollOption: PayrollOption;
                payrollUuid?: string;
              };
              const params = new URLSearchParams({ payrollOption });
              if (payrollUuid) params.set("payrollUuid", payrollUuid);
              navigate(
                `/employees/terminations/${employeeId}/summary?${params.toString()}`,
              );
              break;
            }
            // Already-terminated employees skip straight to a read-only summary
            // with no payrollOption, so no success alert.
            case componentEvents.EMPLOYEE_TERMINATION_VIEW_SUMMARY:
              navigate(`/employees/terminations/${employeeId}/summary`);
              break;
            case componentEvents.CANCEL:
              navigate("/employees");
              break;
          }
        }}
      />
    </>
  );
}

export function Summary() {
  const { employeeId } = useParams<"employeeId">();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const payrollOption = parsePayrollOption(searchParams.get("payrollOption"));
  const payrollUuid = searchParams.get("payrollUuid") ?? undefined;
  return (
    <>
      <Link to="/employees" className={styles.backLink}>
        <span aria-hidden="true">&larr;</span>Back to employees
      </Link>
      <EmployeeManagement.TerminationSummary
        companyId={COMPANY_ID}
        employeeId={employeeId!}
        payrollOption={payrollOption}
        payrollUuid={payrollUuid}
        onEvent={(type, payload) => {
          switch (type) {
            case componentEvents.EMPLOYEE_TERMINATION_EDIT:
              navigate(`/employees/terminations/${employeeId}`);
              break;
            case componentEvents.EMPLOYEE_TERMINATION_CANCELLED:
              navigate("/employees");
              break;
            case componentEvents.EMPLOYEE_TERMINATION_RUN_PAYROLL: {
              const { payrollUuid: uuid } = payload as { payrollUuid?: string };
              const suffix = uuid ? `?payrollUuid=${uuid}` : "";
              navigate(
                `/employees/terminations/${employeeId}/dismissal-payroll${suffix}`,
              );
              break;
            }
            case componentEvents.EMPLOYEE_TERMINATION_RUN_OFF_CYCLE_PAYROLL:
              navigate(`/employees/terminations/${employeeId}/dismissal-payroll`);
              break;
          }
        }}
      />
    </>
  );
}

export function DismissalPayroll() {
  const { employeeId } = useParams<"employeeId">();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  return (
    <>
      <Link to="/employees" className={styles.backLink}>
        <span aria-hidden="true">&larr;</span>Back to employees
      </Link>
      <Payroll.DismissalFlow
        companyId={COMPANY_ID}
        employeeId={employeeId!}
        payrollId={searchParams.get("payrollUuid") ?? undefined}
        onEvent={(type) => {
          if (type === componentEvents.PAYROLL_EXIT_FLOW) {
            navigate("/employees");
          }
        }}
      />
    </>
  );
}
