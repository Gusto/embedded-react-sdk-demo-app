import { type Dispatch, type SetStateAction, useState } from "react";
import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  EmployeeManagement,
  EmployeeOnboarding,
  componentEvents,
} from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../config";

// Statuses that indicate the employee is self-onboarding. When true, the admin
// flow skips federal taxes, state taxes, and payment method after compensation
// because the employee will fill those in themselves.
const SELF_ONBOARDING_STATUSES = new Set([
  "self_onboarding_invited",
  "self_onboarding_invited_started",
  "self_onboarding_invited_overdue",
  "self_onboarding_pending_invite",
]);

// Statuses where the EmployeeDocuments (I-9 config) step is no longer needed —
// the employee has already completed onboarding or is awaiting admin review,
// so we route from deductions straight to summary. Matches the SDK guard.
const DOCUMENTS_CONFIG_COMPLETED_STATUSES = new Set([
  "self_onboarding_completed_by_employee",
  "self_onboarding_awaiting_admin_review",
  "onboarding_completed",
]);

// Cross-step ephemeral state that doesn't belong in the URL. The Layout route
// owns it and exposes a [state, setState] tuple to children via Outlet context.
type OnboardingContext = {
  startDate?: string;
  onboardingStatus?: string;
};

type ContextTuple = readonly [
  OnboardingContext,
  Dispatch<SetStateAction<OnboardingContext>>,
];

function Layout() {
  const ctx = useState<OnboardingContext>({});
  return <Outlet context={ctx satisfies ContextTuple} />;
}

function useOnboardingContext() {
  return useOutletContext<ContextTuple>();
}

function EmployeeList() {
  const [, setCtx] = useOnboardingContext();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.EmployeeList
      companyId={COMPANY_ID}
      onEvent={(type, payload) => {
        if (type === componentEvents.EMPLOYEE_CREATE) {
          setCtx({});
          navigate("/employees/new/profile");
        }
        if (type === componentEvents.EMPLOYEE_UPDATE) {
          const data = payload as {
            employeeId: string;
            onboardingStatus: string;
          };
          setCtx({ onboardingStatus: data.onboardingStatus });
          navigate(`/employees/${data.employeeId}/profile`);
        }
      }}
    />
  );
}

function Profile() {
  const { employeeId } = useParams<{ employeeId?: string }>();
  const [, setCtx] = useOnboardingContext();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.Profile
      companyId={COMPANY_ID}
      employeeId={employeeId}
      isAdmin
      isSelfOnboardingEnabled
      onEvent={(type, payload) => {
        if (type === componentEvents.EMPLOYEE_PROFILE_DONE) {
          const data = payload as {
            uuid: string;
            startDate: string;
            onboardingStatus: string;
          };
          setCtx({
            startDate: data.startDate,
            onboardingStatus: data.onboardingStatus,
          });
          navigate(`/employees/${data.uuid}/compensation`);
        }
        if (type === componentEvents.CANCEL) navigate("/employees");
      }}
    />
  );
}

function Compensation() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [{ startDate, onboardingStatus }] = useOnboardingContext();
  const navigate = useNavigate();
  const isSelfOnboarding = SELF_ONBOARDING_STATUSES.has(onboardingStatus ?? "");
  return (
    <EmployeeOnboarding.Compensation
      employeeId={employeeId!}
      startDate={startDate!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_COMPENSATION_DONE) {
          navigate(
            isSelfOnboarding
              ? `/employees/${employeeId}/deductions`
              : `/employees/${employeeId}/federal-taxes`,
          );
        }
      }}
    />
  );
}

function FederalTaxes() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.FederalTaxes
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_FEDERAL_TAXES_DONE) {
          navigate(`/employees/${employeeId}/state-taxes`);
        }
      }}
    />
  );
}

function StateTaxes() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.StateTaxes
      employeeId={employeeId!}
      isAdmin
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_STATE_TAXES_DONE) {
          navigate(`/employees/${employeeId}/payment-method`);
        }
      }}
    />
  );
}

function PaymentMethod() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.PaymentMethod
      employeeId={employeeId!}
      isAdmin
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_PAYMENT_METHOD_DONE) {
          navigate(`/employees/${employeeId}/deductions`);
        }
      }}
    />
  );
}

function Deductions() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [{ onboardingStatus }] = useOnboardingContext();
  const navigate = useNavigate();
  const skipDocumentsConfig = DOCUMENTS_CONFIG_COMPLETED_STATUSES.has(
    onboardingStatus ?? "",
  );
  return (
    <EmployeeOnboarding.Deductions
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_DEDUCTION_DONE) {
          navigate(
            skipDocumentsConfig
              ? `/employees/${employeeId}/summary`
              : `/employees/${employeeId}/employee-documents`,
          );
        }
      }}
    />
  );
}

function EmployeeDocuments() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  // Lives under EmployeeManagement in current SDK; will migrate to
  // EmployeeOnboarding.EmployeeDocuments in a future release per its
  // @deprecated note.
  return (
    <EmployeeManagement.EmployeeDocuments
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_DOCUMENTS_DONE) {
          navigate(`/employees/${employeeId}/summary`);
        }
      }}
    />
  );
}

function Summary() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [, setCtx] = useOnboardingContext();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.OnboardingSummary
      employeeId={employeeId!}
      isAdmin
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEES_LIST) {
          setCtx({});
          navigate("/employees");
        }
      }}
    />
  );
}

// State machine table: each route maps a URL to a step block. Layout is the
// parent route so all steps share Outlet context for cross-step state.
export function Employees() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<EmployeeList />} />
        <Route path="new/profile" element={<Profile />} />
        <Route path=":employeeId/profile" element={<Profile />} />
        <Route path=":employeeId/compensation" element={<Compensation />} />
        <Route path=":employeeId/federal-taxes" element={<FederalTaxes />} />
        <Route path=":employeeId/state-taxes" element={<StateTaxes />} />
        <Route path=":employeeId/payment-method" element={<PaymentMethod />} />
        <Route path=":employeeId/deductions" element={<Deductions />} />
        <Route
          path=":employeeId/employee-documents"
          element={<EmployeeDocuments />}
        />
        <Route path=":employeeId/summary" element={<Summary />} />
      </Route>
    </Routes>
  );
}
