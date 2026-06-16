import { GustoProvider } from "@gusto/embedded-react-sdk";
import "@gusto/embedded-react-sdk/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AdapterStateProvider,
  useAdapterComponents,
} from "./_demo-infrastructure/component-adapters";
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
  // The `components` prop swaps the SDK's UI primitives for your own. Here it
  // supplies the adapter chosen in the demo tray (undefined = SDK defaults); in
  // a real integration you would pass a fixed component map directly.
  //
  // See the component adapter guide:
  // https://github.com/Gusto/embedded-react-sdk/blob/main/docs/component-adapter/component-adapter.md
  const components = useAdapterComponents();

  return (
    // Themes are key/value pairs passed to the `theme` prop that override the
    // SDK's default visual appearance — colors, typography, radius, shadows, and
    // more. `useThemeOverrides()` here supplies values from the interactive demo
    // tray; in a real integration you would pass your own object directly.
    //
    // See the theming guide for a full variable reference:
    // https://github.com/Gusto/embedded-react-sdk/blob/main/docs/theming/theming-guide.md
    <GustoProvider
      config={{ baseUrl: "http://localhost:3001" }}
      theme={theme}
      components={components}
    >
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

// AdapterStateProvider and ThemeStateProvider are internal demo infrastructure —
// they manage the live component-adapter and theme-override state that power the
// customization tray. Neither is part of a typical GustoProvider integration.
function AppWithDemoConfiguration() {
  return (
    <AdapterStateProvider>
      <ThemeStateProvider>
        <App />
      </ThemeStateProvider>
    </AdapterStateProvider>
  );
}

export default AppWithDemoConfiguration;
