import { Navigate, Route, Routes } from "react-router-dom";
import { ExistingCompanySdkBoundary } from "./ExistingCompanySdkBoundary";
import { AppLayout, buildSharedNav, type NavGroup } from "../newCompany/AppLayout";

const BASE = "/showcase/existing-company";

function buildNav(): NavGroup[] {
  const nav = buildSharedNav(BASE);
  // Prepend Pay employees and Pay contractors to the Payroll group.
  // These features are only available in the existing-company demo (a
  // fresh company has no payrolls to run yet).
  const payroll = nav.find((g) => g.key === "payroll");
  if (payroll?.children) {
    payroll.children.unshift(
      {
        key: "pay-employees",
        label: "Pay employees",
        to: `${BASE}/payroll/pay-employees`,
      },
      {
        key: "pay-contractors",
        label: "Pay contractors",
        to: `${BASE}/payroll/pay-contractors`,
      }
    );
  }
  return nav;
}
import { ExistingCompanyDashboard } from "./ExistingCompanyDashboard";
import { PayrollDocumentDetail } from "../newCompany/PayrollDocumentDetail";
import { PayrollDocuments } from "../newCompany/PayrollDocuments";
import { PayrollPeople } from "../newCompany/PayrollPeople";
import { PayrollPeopleAdd } from "../newCompany/PayrollPeopleAdd";
import { PayrollSettings } from "../newCompany/PayrollSettings";
import { PayrollSettingsSignatory } from "../newCompany/PayrollSettingsSignatory";
import { PayrollSettingsTaxes } from "../newCompany/PayrollSettingsTaxes";
import { PayrollSettingsTaxesState } from "../newCompany/PayrollSettingsTaxesState";
import { PayContractorsCreate } from "./PayContractorsCreate";
import { PayContractorsSummary } from "./PayContractorsSummary";
import { PayrollPayContractors } from "./PayrollPayContractors";
import { PayrollPayEmployees } from "./PayrollPayEmployees";
import { PayrollRunConfiguration } from "./PayrollRunConfiguration";
import { PayrollRunSummary } from "./PayrollRunSummary";
import { CompanyStateProvider } from "../newCompany/useCompanyState";
import { DemoToastProvider } from "../newCompany/demoToast";
import { AdapterProvider } from "../../sdk/adapterContext";
import { DemoSessionProvider } from "../DemoSession";
import { DemoShell } from "../DemoShell";

// The existing-company demo uses the configuration in the local env —
// i.e. the same tokens.json refresh token the rest of the app uses for
// the configured company. We point the SDK at the default proxy URL and
// hardcode the configured company id here.
const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";
const API_BASE_URL = "http://localhost:3001";
const BRAND_NAME = "Hatchwell";
const BRAND_TAGLINE = "Modern finance tools for people-first companies";

export function ExistingCompanyDemo() {
  return (
    <AdapterProvider>
    <DemoShell brandName={BRAND_NAME} brandTagline={BRAND_TAGLINE}>
      <DemoSessionProvider
        companyUuid={COMPANY_ID}
        apiBaseUrl={API_BASE_URL}
        brandName={BRAND_NAME}
        basePath="/showcase/existing-company"
      >
        <DemoToastProvider>
          <CompanyStateProvider>
            <ExistingCompanySdkBoundary apiBaseUrl={API_BASE_URL}>
              <Routes>
                <Route element={<AppLayout nav={buildNav()} />}>
                  <Route
                    index
                    element={<Navigate to="dashboard" replace />}
                  />
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
                  <Route
                    path="payroll/documents"
                    element={<PayrollDocumentsScreen />}
                  />
                  <Route
                    path="payroll/documents/:formId"
                    element={<PayrollDocumentDetailScreen />}
                  />
                  <Route
                    path="payroll/pay-employees"
                    element={<PayrollPayEmployeesScreen />}
                  />
                  <Route
                    path="payroll/pay-employees/:payrollUuid/configuration"
                    element={<PayrollRunConfigurationScreen />}
                  />
                  <Route
                    path="payroll/pay-employees/:payrollUuid/summary"
                    element={<PayrollRunSummaryScreen />}
                  />
                  <Route
                    path="payroll/pay-contractors"
                    element={<PayrollPayContractorsScreen />}
                  />
                  <Route
                    path="payroll/pay-contractors/new"
                    element={<PayContractorsCreateScreen />}
                  />
                  <Route
                    path="payroll/pay-contractors/:paymentGroupId/summary"
                    element={<PayContractorsSummaryScreen />}
                  />
                </Route>
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ExistingCompanySdkBoundary>
          </CompanyStateProvider>
        </DemoToastProvider>
      </DemoSessionProvider>
    </DemoShell>
    </AdapterProvider>
  );
}

function DashboardScreen() {
  return <ExistingCompanyDashboard companyUuid={COMPANY_ID} />;
}

function PayrollPeopleScreen() {
  return <PayrollPeople companyUuid={COMPANY_ID} />;
}

function PayrollPeopleAddScreen() {
  return <PayrollPeopleAdd companyUuid={COMPANY_ID} />;
}

function PayrollSettingsScreen() {
  return <PayrollSettings companyUuid={COMPANY_ID} />;
}

function PayrollSettingsTaxesScreen() {
  return <PayrollSettingsTaxes companyUuid={COMPANY_ID} />;
}

function PayrollSettingsTaxesStateScreen() {
  return <PayrollSettingsTaxesState companyUuid={COMPANY_ID} />;
}

function PayrollSettingsSignatoryScreen() {
  return <PayrollSettingsSignatory companyUuid={COMPANY_ID} />;
}

function PayrollDocumentsScreen() {
  return <PayrollDocuments companyUuid={COMPANY_ID} />;
}

function PayrollDocumentDetailScreen() {
  return <PayrollDocumentDetail companyUuid={COMPANY_ID} />;
}

function PayrollPayEmployeesScreen() {
  return <PayrollPayEmployees companyUuid={COMPANY_ID} />;
}

function PayrollRunConfigurationScreen() {
  return <PayrollRunConfiguration companyUuid={COMPANY_ID} />;
}

function PayrollRunSummaryScreen() {
  return <PayrollRunSummary companyUuid={COMPANY_ID} />;
}

function PayrollPayContractorsScreen() {
  return <PayrollPayContractors companyUuid={COMPANY_ID} />;
}

function PayContractorsCreateScreen() {
  return <PayContractorsCreate companyUuid={COMPANY_ID} />;
}

function PayContractorsSummaryScreen() {
  return <PayContractorsSummary companyUuid={COMPANY_ID} />;
}
