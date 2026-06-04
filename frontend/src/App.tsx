import { GustoProvider } from "@gusto/embedded-react-sdk";
import "@gusto/embedded-react-sdk/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CompanyOnboardingRoutes } from "./demos/company-onboarding/routes";
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
          {CompanyOnboardingRoutes}
          {OnboardedCompanyRoutes}
          {EmployeeSelfOnboardingRoutes}
        </Routes>
        <HomeButton />
      </BrowserRouter>
    </GustoProvider>
  );
}

export default App;
