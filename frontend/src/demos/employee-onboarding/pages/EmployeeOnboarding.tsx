import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Outlet,
  Route,
  Routes,
  useMatch,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  EmployeeManagement,
  // Aliased so this file can export a page component named
  // `EmployeeOnboarding` matching the demo's name without colliding with
  // the SDK namespace.
  EmployeeOnboarding as Onboarding,
  componentEvents,
} from "@gusto/embedded-react-sdk";
import { CenteredPage } from "../../../shared/CenteredPage/CenteredPage";
import { COMPANY_ID } from "../../../config";

// Statuses indicating the employee is self-onboarding. When the current
// onboardingStatus is in this set, the admin flow skips federal taxes,
// state taxes, and payment method after compensation — the employee will
// fill those in themselves.
const SELF_ONBOARDING_STATUSES = new Set([
  "self_onboarding_invited",
  "self_onboarding_invited_started",
  "self_onboarding_invited_overdue",
  "self_onboarding_pending_invite",
]);

// Statuses where the EmployeeDocuments (I-9 config) step is no longer needed:
// the employee has already completed onboarding or is awaiting admin review,
// so deductions routes straight to summary. Mirrors the SDK's
// employeeDocumentsGuard.
const DOCUMENTS_CONFIG_COMPLETED_STATUSES = new Set([
  "self_onboarding_completed_by_employee",
  "self_onboarding_awaiting_admin_review",
  "onboarding_completed",
]);

// Cross-step ephemeral state that doesn't belong in the URL. OnboardingFlow
// owns it and exposes a [state, setState] tuple to children via Outlet context.
type OnboardingContext = {
  startDate?: string;
  onboardingStatus?: string;
};

type OnboardingContextValue = [
  OnboardingContext,
  Dispatch<SetStateAction<OnboardingContext>>,
];

// localStorage is a single flat key/value store shared across the origin, so
// we namespace ourselves with this prefix to avoid colliding with other code
// on the page.
const ONBOARDING_STORAGE_PREFIX = "gusto-demo-employee-onboarding:";

function readPersistedContext(key: string | null): OnboardingContext {
  if (!key) return {};
  const raw = localStorage.getItem(key);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as OnboardingContext;
  } catch {
    return {};
  }
}

// `OnboardingFlow` is the parent route that owns cross-step state for an
// in-progress employee onboarding (`startDate`, `onboardingStatus`) and
// exposes it to step routes via Outlet context. Persists per-employee to
// localStorage so a mid-flow refresh restores the values Compensation and
// Deductions depend on.
//
// localStorage is a demo crutch — in a real integration, persist this in
// your own database keyed by employee, alongside whatever else you track
// for in-progress onboarding.
function OnboardingFlow() {
  const match = useMatch("/employee-onboarding/:employeeId/*");
  const storageKey = match?.params.employeeId
    ? `${ONBOARDING_STORAGE_PREFIX}${match.params.employeeId}`
    : null;

  const [ctx, setCtx] = useState<OnboardingContext>(() =>
    readPersistedContext(storageKey),
  );

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(ctx));
  }, [storageKey, ctx]);

  const value: OnboardingContextValue = [ctx, setCtx];
  return (
    <CenteredPage>
      <Outlet context={value} />
    </CenteredPage>
  );
}

function useOnboardingContext() {
  return useOutletContext<OnboardingContextValue>();
}

function EmployeeList() {
  const [, setCtx] = useOnboardingContext();
  const navigate = useNavigate();
  return (
    <Onboarding.EmployeeList
      companyId={COMPANY_ID}
      onEvent={(type, payload) => {
        if (type === componentEvents.EMPLOYEE_CREATE) {
          setCtx({});
          navigate("/employee-onboarding/new/profile");
        }
        if (type === componentEvents.EMPLOYEE_UPDATE) {
          const data = payload as {
            employeeId: string;
            onboardingStatus: string;
          };
          setCtx({ onboardingStatus: data.onboardingStatus });
          navigate(`/employee-onboarding/${data.employeeId}/profile`);
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
    <Onboarding.Profile
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
          navigate(`/employee-onboarding/${data.uuid}/compensation`);
        }
        if (type === componentEvents.CANCEL) navigate("/employee-onboarding");
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
    <Onboarding.Compensation
      employeeId={employeeId!}
      startDate={startDate!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_COMPENSATION_DONE) {
          navigate(
            isSelfOnboarding
              ? `/employee-onboarding/${employeeId}/deductions`
              : `/employee-onboarding/${employeeId}/federal-taxes`,
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
    <Onboarding.FederalTaxes
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_FEDERAL_TAXES_DONE) {
          navigate(`/employee-onboarding/${employeeId}/state-taxes`);
        }
      }}
    />
  );
}

function StateTaxes() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  return (
    <Onboarding.StateTaxes
      employeeId={employeeId!}
      isAdmin
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_STATE_TAXES_DONE) {
          navigate(`/employee-onboarding/${employeeId}/payment-method`);
        }
      }}
    />
  );
}

function PaymentMethod() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  return (
    <Onboarding.PaymentMethod
      employeeId={employeeId!}
      isAdmin
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_PAYMENT_METHOD_DONE) {
          navigate(`/employee-onboarding/${employeeId}/deductions`);
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
    <Onboarding.Deductions
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_DEDUCTION_DONE) {
          navigate(
            skipDocumentsConfig
              ? `/employee-onboarding/${employeeId}/summary`
              : `/employee-onboarding/${employeeId}/employee-documents`,
          );
        }
      }}
    />
  );
}

// Lives under EmployeeManagement in the current SDK; will move to
// EmployeeOnboarding.EmployeeDocuments in a future release per its
// @deprecated note on the EmployeeManagement export.
function EmployeeDocuments() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.EmployeeDocuments
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_DOCUMENTS_DONE) {
          navigate(`/employee-onboarding/${employeeId}/summary`);
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
    <Onboarding.OnboardingSummary
      employeeId={employeeId!}
      isAdmin
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEES_LIST) {
          setCtx({});
          navigate("/employee-onboarding");
        }
      }}
    />
  );
}

// State machine table: each route maps a URL to a step block. OnboardingFlow
// is the parent route so all steps share Outlet context for cross-step state.
export function EmployeeOnboarding() {
  return (
    <Routes>
      <Route element={<OnboardingFlow />}>
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
