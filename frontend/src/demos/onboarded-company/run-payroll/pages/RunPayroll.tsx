import { useNavigate, useParams } from "react-router-dom";
import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../../config";
import styles from "./PayrollSuccess.module.css";

// Composes the SDK's individual payroll blocks behind react-router instead of
// the all-in-one <Payroll.PayrollFlow />, so each step is its own URL and a
// refresh resumes it. State lives in the URL (payrollId / employeeId); each
// block fetches its own data.
export function PayrollLanding() {
  const navigate = useNavigate();
  return (
    <Payroll.PayrollLanding
      companyId={COMPANY_ID}
      onEvent={(type, payload) => {
        switch (type) {
          case componentEvents.RUN_PAYROLL_SELECTED: {
            const { payrollUuid } = payload as { payrollUuid: string };
            navigate(`/run-payroll/${payrollUuid}/configuration`);
            break;
          }
          case componentEvents.REVIEW_PAYROLL: {
            const { payrollUuid } = payload as { payrollUuid: string };
            navigate(`/run-payroll/${payrollUuid}/overview`);
            break;
          }
          case componentEvents.RUN_OFF_CYCLE_PAYROLL:
            navigate("/run-payroll/off-cycle");
            break;
          case componentEvents.RUN_PAYROLL_BLOCKERS_VIEW_ALL:
            navigate("/run-payroll/blockers");
            break;
        }
      }}
    />
  );
}

export function OffCycleCreate() {
  const navigate = useNavigate();
  return (
    <Payroll.OffCycleCreation
      companyId={COMPANY_ID}
      onEvent={(type, payload) => {
        if (type === componentEvents.OFF_CYCLE_CREATED) {
          const { payrollUuid } = payload as { payrollUuid: string };
          navigate(`/run-payroll/${payrollUuid}/configuration`);
        }
      }}
    />
  );
}

export function Configuration() {
  const { payrollId } = useParams<"payrollId">();
  const navigate = useNavigate();
  return (
    <Payroll.PayrollConfiguration
      companyId={COMPANY_ID}
      payrollId={payrollId!}
      onEvent={(type, payload) => {
        switch (type) {
          case componentEvents.RUN_PAYROLL_CALCULATED:
            navigate(`/run-payroll/${payrollId}/success`);
            break;
          case componentEvents.RUN_PAYROLL_EMPLOYEE_EDIT: {
            const { employeeId } = payload as { employeeId: string };
            navigate(`/run-payroll/${payrollId}/edit-employee/${employeeId}`);
            break;
          }
          case componentEvents.RUN_PAYROLL_BLOCKERS_VIEW_ALL:
            navigate("/run-payroll/blockers");
            break;
        }
      }}
    />
  );
}

// Custom interstitial after PayrollConfiguration finishes calculating. The SDK
// flow goes straight from calculate to the overview; this demo inserts a
// success screen first, then hands off to PayrollOverview via the CTA.
export function PayrollSuccess() {
  const { payrollId } = useParams<"payrollId">();
  const navigate = useNavigate();
  return (
    <div className={styles.card}>
      <span className={styles.icon} aria-hidden="true">
        &#10003;
      </span>
      <h1 className={styles.title}>Congrats on successfully running payroll!</h1>
      <p className={styles.subtitle}>
        Your payroll has been calculated. Continue to the overview to review the
        details and submit.
      </p>
      <button
        type="button"
        className={styles.cta}
        onClick={() => navigate(`/run-payroll/${payrollId}/overview`)}
      >
        Continue to overview
      </button>
    </div>
  );
}

export function Overview() {
  const { payrollId } = useParams<"payrollId">();
  const navigate = useNavigate();
  return (
    <Payroll.PayrollOverview
      companyId={COMPANY_ID}
      payrollId={payrollId!}
      onEvent={(type) => {
        switch (type) {
          case componentEvents.RUN_PAYROLL_RECEIPT_GET:
            navigate(`/run-payroll/${payrollId}/receipts`);
            break;
          case componentEvents.RUN_PAYROLL_EDIT:
            navigate(`/run-payroll/${payrollId}/configuration`);
            break;
          case componentEvents.RUN_PAYROLL_CANCELLED:
            navigate("/run-payroll");
            break;
        }
      }}
    />
  );
}

export function EditEmployee() {
  const { payrollId, employeeId } = useParams<"payrollId" | "employeeId">();
  const navigate = useNavigate();
  return (
    <Payroll.PayrollEditEmployee
      companyId={COMPANY_ID}
      payrollId={payrollId!}
      employeeId={employeeId!}
      onEvent={(type) => {
        if (
          type === componentEvents.RUN_PAYROLL_EMPLOYEE_SAVED ||
          type === componentEvents.RUN_PAYROLL_EMPLOYEE_CANCELLED
        ) {
          navigate(`/run-payroll/${payrollId}/configuration`);
        }
      }}
    />
  );
}

export function Receipts() {
  const { payrollId } = useParams<"payrollId">();
  return <Payroll.PayrollReceipts payrollId={payrollId!} onEvent={() => {}} />;
}

export function Blockers() {
  return <Payroll.PayrollBlockerList companyId={COMPANY_ID} onEvent={() => {}} />;
}
