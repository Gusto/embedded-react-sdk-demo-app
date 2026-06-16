import { GustoProvider } from "@gusto/embedded-react-sdk";
import "@gusto/embedded-react-sdk/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ThemeStateProvider,
  useThemeOverrides,
} from "./_demo-infrastructure/theming";
import { CompanyOnboardingRoutes } from "./demos/company-onboarding/routes";
import { EmployeeOnboardingRoutes } from "./demos/employee-onboarding/routes";
import { EmployeeSelfOnboardingRoutes } from "./demos/employee-self-onboarding/routes";
import { OnboardedCompanyRoutes } from "./demos/onboarded-company/routes";
import { Landing } from "./Landing";
import { HomeButton } from "./shared/HomeButton/HomeButton";
import "./App.css";

function App() {
  const theme = useThemeOverrides();

  return (
    // Themes are key/value pairs passed to the `theme` prop that override the
    // SDK's default visual appearance — colors, typography, radius, shadows, and
    // more. `useThemeOverrides()` here supplies values from the interactive demo
    // tray; in a real integration you would pass your own object directly.
    //
    // See the theming guide for a full variable reference:
    // https://github.com/Gusto/embedded-react-sdk/blob/main/docs/theming/theming-guide.md
    <GustoProvider config={{ baseUrl: "http://localhost:3001" }} theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Landing />} />
          {CompanyOnboardingRoutes}
          {OnboardedCompanyRoutes}
          {EmployeeOnboardingRoutes}
          {EmployeeSelfOnboardingRoutes}
        </Routes>
        <HomeButton />
      </BrowserRouter>
    </GustoProvider>
  );
}

// ThemeStateProvider is internal demo infrastructure — it manages the live
// theme override state that powers the "Edit theme" tray. It is not part of
// a typical GustoProvider integration.
function AppWithDemoConfiguration() {
  return (
    <ThemeStateProvider>
      <App />
    </ThemeStateProvider>
  );
}

export default AppWithDemoConfiguration;
