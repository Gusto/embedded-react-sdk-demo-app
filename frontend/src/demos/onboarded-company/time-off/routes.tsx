import { Route } from "react-router-dom";
import {
  AddEmployees,
  HolidayAddEmployees,
  HolidayCreate,
  HolidayEdit,
  HolidayEmployees,
  HolidaySchedule,
  PolicyDetail,
  PolicyDetailsCreate,
  PolicyDetailsEdit,
  PolicyListPage,
  PolicySettingsCreate,
  PolicySettingsEdit,
  SelectPolicyType,
} from "./pages/TimeOff";

export const TimeOffRoutes = (
  <Route path="time-off">
    <Route index element={<PolicyListPage />} />
    <Route path="new" element={<SelectPolicyType />} />
    <Route path="new/:policyType" element={<PolicyDetailsCreate />} />
    <Route path="policies/:policyType/:policyId">
      <Route index element={<PolicyDetail />} />
      <Route path="settings" element={<PolicySettingsCreate />} />
      <Route path="settings/edit" element={<PolicySettingsEdit />} />
      <Route path="details/edit" element={<PolicyDetailsEdit />} />
      <Route path="employees/add" element={<AddEmployees />} />
    </Route>
    <Route path="holiday">
      <Route index element={<HolidayEmployees />} />
      <Route path="new" element={<HolidayCreate />} />
      <Route path="edit" element={<HolidayEdit />} />
      <Route path="employees/add" element={<HolidayAddEmployees />} />
      <Route path="schedule" element={<HolidaySchedule />} />
    </Route>
  </Route>
);
