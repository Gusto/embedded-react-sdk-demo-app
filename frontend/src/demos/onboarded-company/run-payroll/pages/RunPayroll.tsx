import { useNavigate, useParams } from "react-router-dom";
import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../../config";

// This demo composes the SDK's individual payroll block components behind
// react-router instead of using the all-in-one <Payroll.PayrollFlow />. Each
// step is its own URL, so a browser refresh resumes the correct step rather
// than dropping the user back at the start. No cross-step persistence is
// needed: payrollId / employeeId live in the URL, and each block fetches its
// own pay period and status from the API.

// PayrollLanding is the landing for the whole flow. It already provides the
// Run payroll / Payroll history tabs and surfaces blocker/RFI/recovery alerts
// when present, so we don't recreate those. It runs its own state machine for
// in-place history viewing (receipt/summary), but the Flow re-emits every event
// to onEvent, so the actions that leave the landing still bubble up here for us
// to route to real URLs. We deliberately ignore the in-place history events
// (RUN_PAYROLL_RECEIPT_VIEWED / RUN_PAYROLL_SUMMARY_VIEWED) and let the landing
// handle those itself.
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

// Off-cycle creation runs before the payroll exists. This single block covers
// reason selection, pay period dates, employee selection, and deductions; on
// submit the SDK creates the off-cycle payroll and returns the new uuid, after
// which the flow merges into the same execution path as a regular payroll.
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
            navigate(`/run-payroll/${payrollId}/overview`);
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

// The blockers block is self-contained: it lists payroll blockers and renders
// payroll-blocking information requests (RFIs) and recovery cases inline, each
// with its own resolution modal. Mounting it on a route is all the demo needs.
export function Blockers() {
  return <Payroll.PayrollBlockerList companyId={COMPANY_ID} onEvent={() => {}} />;
}
