import { Navigate, Route } from "react-router-dom";
import { DashboardTabs } from "./components/DashboardTabs/DashboardTabs";
import {
  AddEmployee,
  BasicDetailsTab,
  CompensationAdd,
  CompensationAddAnother,
  CompensationEdit,
  DeductionAdd,
  DeductionEdit,
  DocumentView,
  DocumentsTab,
  EmployeeListPage,
  FederalTaxesEdit,
  HomeAddressEdit,
  JobAndPayTab,
  PaymentMethodAdd,
  PaymentMethodSplit,
  ProfileEdit,
  StateTaxesEdit,
  TaxesTab,
  WorkAddressEdit,
} from "./pages/ManageEmployees";
import { BlockCompositionsIndex } from "./pages/BlockCompositionsDemo";
import {
  BasicDetailsCompositions,
  JobAndPayCompositions,
  TaxesCompositions,
  DocumentsCompositions,
} from "./pages/CompositionPages";

// Manage routes sit outside the DashboardTabs layout group so an edit form
// renders without the tab sub-nav, like the SDK dashboard's full-view swap.
export const ManageEmployeesRoutes = (
  <Route path="employees">
    <Route index element={<EmployeeListPage />} />
    <Route path="new" element={<AddEmployee />} />
    <Route path=":employeeId">
      <Route element={<DashboardTabs />}>
        <Route index element={<Navigate to="basic-details" replace />} />
        <Route path="basic-details" element={<BasicDetailsTab />} />
        <Route path="job-and-pay" element={<JobAndPayTab />} />
        <Route path="taxes" element={<TaxesTab />} />
        <Route path="documents" element={<DocumentsTab />} />
      </Route>
      <Route path="profile/edit" element={<ProfileEdit />} />
      <Route path="home-address/edit" element={<HomeAddressEdit />} />
      <Route path="work-address/edit" element={<WorkAddressEdit />} />
      <Route path="federal-taxes/edit" element={<FederalTaxesEdit />} />
      <Route path="state-taxes/edit" element={<StateTaxesEdit />} />
      <Route path="payment-method/add" element={<PaymentMethodAdd />} />
      <Route path="payment-method/split" element={<PaymentMethodSplit />} />
      <Route path="documents/:formId" element={<DocumentView />} />
      <Route path="compensation/add" element={<CompensationAdd />} />
      <Route path="compensation/add-another" element={<CompensationAddAnother />} />
      <Route path="compensation/:jobId/edit" element={<CompensationEdit />} />
      <Route path="deductions/add" element={<DeductionAdd />} />
      <Route path="deductions/:deductionId/edit" element={<DeductionEdit />} />
      <Route path="compositions" element={<BlockCompositionsIndex />} />
      <Route path="compositions/basic-details/*" element={<BasicDetailsCompositions />} />
      <Route path="compositions/job-and-pay/*" element={<JobAndPayCompositions />} />
      <Route path="compositions/taxes/*" element={<TaxesCompositions />} />
      <Route path="compositions/documents/*" element={<DocumentsCompositions />} />
      <Route path="compensation-composition/*" element={<></>} />
      <Route path="deductions-composition/*" element={<></>} />
      <Route path="payment-method-composition/*" element={<></>} />
      <Route path="profile-composition/*" element={<></>} />
      <Route path="home-address-composition/*" element={<></>} />
      <Route path="work-address-composition/*" element={<></>} />
      <Route path="federal-taxes-composition/*" element={<></>} />
      <Route path="state-taxes-composition/*" element={<></>} />
      <Route path="documents-composition/*" element={<></>} />
    </Route>
  </Route>
);
