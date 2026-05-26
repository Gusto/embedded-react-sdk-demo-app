import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AdapterProvider } from "../../sdk/adapterContext";
import { DemoSdkBoundary } from "../DemoSdkBoundary";
import { DemoSessionProvider } from "../DemoSession";
import { DemoShell } from "../DemoShell";
import { DemoSpinner } from "../DemoSpinner";
import { AppLayout, buildSharedNav } from "./AppLayout";
import { Dashboard } from "./Dashboard";
import { DemoToastProvider } from "./demoToast";
import { Gate } from "./Gate";
import { IntroHero } from "./IntroHero";
import { OnboardingChecklist } from "./OnboardingChecklist";
import { OnboardingFlow } from "./OnboardingFlow";
import { PayrollDocumentDetail } from "./PayrollDocumentDetail";
import { PayrollDocuments } from "./PayrollDocuments";
import { PayrollPeople } from "./PayrollPeople";
import { PayrollPeopleAdd } from "./PayrollPeopleAdd";
import { PayrollSettings } from "./PayrollSettings";
import { PayrollSettingsSignatory } from "./PayrollSettingsSignatory";
import { PayrollSettingsTaxes } from "./PayrollSettingsTaxes";
import { PayrollSettingsTaxesState } from "./PayrollSettingsTaxesState";
import { CompanyStateProvider } from "./useCompanyState";
import { useDemoCompany } from "./useDemoCompany";
import { BRAND_NAME, BRAND_TAGLINE } from "./types";

export function NewCompanyDemo() {
  return (
    <AdapterProvider>
    <DemoShell
      brandName={BRAND_NAME}
      brandTagline={BRAND_TAGLINE}
      headerAction={<CreateNewDemoButton />}
    >
      <DemoToastProvider>
        <CompanyStateGate>
          <Routes>
          <Route index element={<Gate />} />
          <Route path="start" element={<StartScreen />} />
          <Route path="onboarding" element={<OnboardingScreen />} />
          <Route element={<AppShell />}>
            <Route path="dashboard" element={<DashboardScreen />} />
            <Route path="payroll/people" element={<PayrollPeopleScreen />} />
            <Route
              path="payroll/people/add"
              element={<PayrollPeopleAddScreen />}
            />
            <Route path="payroll/settings" element={<PayrollSettingsScreen />} />
            <Route
              path="payroll/settings/taxes"
              element={<PayrollSettingsTaxesScreen />}
            />
            <Route
              path="payroll/settings/taxes/:state"
              element={<PayrollSettingsTaxesStateScreen />}
            />
            <Route
              path="payroll/settings/signatory"
              element={<PayrollSettingsSignatoryScreen />}
            />
            <Route path="payroll/documents" element={<PayrollDocumentsScreen />} />
            <Route
              path="payroll/documents/:formId"
              element={<PayrollDocumentDetailScreen />}
            />
          </Route>
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
        </CompanyStateGate>
      </DemoToastProvider>
    </DemoShell>
    </AdapterProvider>
  );
}

function AppShell() {
  const { companyUuid, status } = useDemoCompany();
  if (status === "loading") return <Loading />;
  if (!companyUuid)
    return <Navigate to="/showcase/new-company/start" replace />;
  return (
    <DemoSdkBoundary companyUuid={companyUuid}>
      <AppLayout
        nav={buildSharedNav("/showcase/new-company")}
        sidebarFooter={<OnboardingChecklist />}
      />
    </DemoSdkBoundary>
  );
}

function StartScreen() {
  const navigate = useNavigate();
  const { create, creating, error } = useDemoCompany();

  async function start() {
    const uuid = await create();
    if (uuid)
      navigate("/showcase/new-company/onboarding", { replace: true });
  }

  return (
    <IntroHero
      phase={
        error
          ? { status: "error", reason: error }
          : creating
            ? { status: "creating" }
            : { status: "intro" }
      }
      onStart={start}
    />
  );
}

function OnboardingScreen() {
  const navigate = useNavigate();
  const { companyUuid, status } = useDemoCompany();

  if (status === "loading") return <Loading />;
  if (!companyUuid)
    return <Navigate to="/showcase/new-company/start" replace />;

  return (
    <DemoSdkBoundary companyUuid={companyUuid}>
      <OnboardingFlow
        companyUuid={companyUuid}
        onComplete={() =>
          navigate("/showcase/new-company/dashboard", { replace: true })
        }
      />
    </DemoSdkBoundary>
  );
}

function DashboardScreen() {
  const { companyUuid } = useDemoCompany();
  return companyUuid ? <Dashboard companyUuid={companyUuid} /> : null;
}

function PayrollPeopleScreen() {
  const { companyUuid } = useDemoCompany();
  return companyUuid ? <PayrollPeople companyUuid={companyUuid} /> : null;
}

function PayrollPeopleAddScreen() {
  const { companyUuid } = useDemoCompany();
  return companyUuid ? <PayrollPeopleAdd companyUuid={companyUuid} /> : null;
}

function PayrollSettingsScreen() {
  const { companyUuid } = useDemoCompany();
  return companyUuid ? <PayrollSettings companyUuid={companyUuid} /> : null;
}

function PayrollSettingsTaxesScreen() {
  const { companyUuid } = useDemoCompany();
  return companyUuid ? <PayrollSettingsTaxes companyUuid={companyUuid} /> : null;
}

function PayrollSettingsTaxesStateScreen() {
  const { companyUuid } = useDemoCompany();
  return companyUuid ? (
    <PayrollSettingsTaxesState companyUuid={companyUuid} />
  ) : null;
}

function PayrollSettingsSignatoryScreen() {
  const { companyUuid } = useDemoCompany();
  return companyUuid ? (
    <PayrollSettingsSignatory companyUuid={companyUuid} />
  ) : null;
}

function PayrollDocumentsScreen() {
  const { companyUuid } = useDemoCompany();
  return companyUuid ? <PayrollDocuments companyUuid={companyUuid} /> : null;
}

function PayrollDocumentDetailScreen() {
  const { companyUuid } = useDemoCompany();
  return companyUuid ? (
    <PayrollDocumentDetail companyUuid={companyUuid} />
  ) : null;
}

function CompanyStateGate({ children }: { children: React.ReactNode }) {
  const { companyUuid } = useDemoCompany();
  if (!companyUuid) return <>{children}</>;
  return (
    <DemoSessionProvider
      companyUuid={companyUuid}
      apiBaseUrl={`http://localhost:3001/demo/${companyUuid}`}
      brandName={BRAND_NAME}
      basePath="/showcase/new-company"
    >
      <CompanyStateProvider>{children}</CompanyStateProvider>
    </DemoSessionProvider>
  );
}


function CreateNewDemoButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { reset } = useDemoCompany();
  // On the start screen there's no persisted company yet — Get Started
  // creates the only one — so the reset/create-new control is redundant.
  if (pathname === "/showcase/new-company/start") return null;
  return (
    <button
      type="button"
      onClick={async () => {
        await reset();
        navigate("/showcase/new-company/start");
      }}
      className="inline-flex h-8 cursor-pointer items-center rounded-full bg-neutral-900 px-3 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
    >
      Create new demo
    </button>
  );
}

function Loading() {
  return <DemoSpinner />;
}
