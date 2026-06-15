import { GustoProvider } from "@gusto/embedded-react-sdk";
import "@gusto/embedded-react-sdk/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AboutDemoPage } from "./AboutDemoPage";
import { CompanyOnboardingRoutes } from "./demos/company-onboarding/routes";
import { EmployeeOnboardingRoutes } from "./demos/employee-onboarding/routes";
import { EmployeeSelfOnboardingRoutes } from "./demos/employee-self-onboarding/routes";
import { OnboardedCompanyRoutes } from "./demos/onboarded-company/routes";
import { Landing } from "./Landing";
import { HomeButton } from "./shared/HomeButton/HomeButton";
import "./App.css";

function App() {
  return (
    <GustoProvider config={{ baseUrl: "http://localhost:3001" }}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Landing />} />
          <Route path="/about-demo" element={<AboutDemoPage />} />
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

export default App;
