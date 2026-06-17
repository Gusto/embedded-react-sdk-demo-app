import { useNavigate } from "react-router-dom";
import {
  CompanyOnboarding,
  EmployeeOnboarding,
  componentEvents,
} from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../config";
import { CompanyDocumentSignerComposition } from "../block-compositions/CompanyDocumentSignerComposition";
import { StateTaxesComposition } from "../block-compositions/StateTaxesComposition";

// This demo composes the individual SDK company-onboarding blocks behind
// react-router so each step owns a URL. For a turnkey integration, skip all of
// this and render <CompanyOnboarding.OnboardingFlow .../>, which runs the same
// steps inside one component.

// OnboardingOverview shows either the list of steps still to fill out or the
// summary and CTA to wrap up the company, choosing between them based on the
// company's onboarding status. A real integration starts here when it has a
// company to onboard; this demo skips it as the entry and just finishes with it.
export function Overview() {
  const navigate = useNavigate();
  return (
    <CompanyOnboarding.OnboardingOverview
      companyId={COMPANY_ID}
      onEvent={(type) => {
        switch (type) {
          case componentEvents.COMPANY_OVERVIEW_DONE:
            navigate("/");
            break;
          case componentEvents.COMPANY_OVERVIEW_CONTINUE:
            navigate("/company-onboarding/locations");
            break;
        }
      }}
    />
  );
}

export function Locations() {
  const navigate = useNavigate();
  return (
    <CompanyOnboarding.Locations
      companyId={COMPANY_ID}
      onEvent={(type) => {
        if (type === componentEvents.COMPANY_LOCATION_DONE) {
          navigate("/company-onboarding/federal-taxes");
        }
      }}
    />
  );
}

export function FederalTaxes() {
  const navigate = useNavigate();
  return (
    <CompanyOnboarding.FederalTaxes
      companyId={COMPANY_ID}
      onEvent={(type) => {
        if (type === componentEvents.COMPANY_FEDERAL_TAXES_DONE) {
          navigate("/company-onboarding/industry");
        }
      }}
    />
  );
}

export function Industry() {
  const navigate = useNavigate();
  return (
    <CompanyOnboarding.Industry
      companyId={COMPANY_ID}
      onEvent={(type) => {
        if (type === componentEvents.COMPANY_INDUSTRY_SELECTED) {
          navigate("/company-onboarding/bank-account");
        }
      }}
    />
  );
}

export function BankAccount() {
  const navigate = useNavigate();
  return (
    <CompanyOnboarding.BankAccount
      companyId={COMPANY_ID}
      onEvent={(type) => {
        if (type === componentEvents.COMPANY_BANK_ACCOUNT_DONE) {
          navigate("/company-onboarding/employees");
        }
      }}
    />
  );
}

// The employees step delegates the entire employee onboarding flow to a single
// SDK block. It drives its own internal steps (list -> profile -> ... ->
// summary) and emits EMPLOYEE_ONBOARDING_DONE when the admin is finished adding
// employees. Because OnboardingFlow keeps step state in memory, those sub-steps
// are not URL-addressable and a refresh restarts the employee flow (company
// progress is unaffected — it's read from the server). If you want each
// employee sub-step to be its own refresh-safe route, replicate the granular
// pattern in frontend/src/demos/employee-onboarding/ here instead of mounting
// the all-in-one block.
export function Employees() {
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.OnboardingFlow
      companyId={COMPANY_ID}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_ONBOARDING_DONE) {
          navigate("/company-onboarding/pay-schedule");
        }
      }}
    />
  );
}

export function PaySchedule() {
  const navigate = useNavigate();
  return (
    <CompanyOnboarding.PaySchedule
      companyId={COMPANY_ID}
      onEvent={(type) => {
        if (type === componentEvents.PAY_SCHEDULE_DONE) {
          navigate("/company-onboarding/state-taxes");
        }
      }}
    />
  );
}

// StateTaxes is a composite block: it has smaller sub-steps (state-taxes list +
// per-state form) that we route individually here. That routed implementation
// lives in block-compositions/. Render <CompanyOnboarding.StateTaxes .../> instead
// for the turnkey single-component step.
export function StateTaxes() {
  const navigate = useNavigate();
  return (
    <StateTaxesComposition
      companyId={COMPANY_ID}
      basePath="/company-onboarding/state-taxes"
      onComplete={() => navigate("/company-onboarding/documents")}
    />
  );
}

// Final step. On completion the flow loops to the overview summary, which now
// reflects the completed onboarding status.
// DocumentSigner is a composite block: it has smaller sub-steps (document list +
// assign signatory + signature form) that we route individually here. That routed
// implementation lives in block-compositions/. Render
// <CompanyOnboarding.DocumentSigner .../> instead for the turnkey single-component
// step.
export function Documents() {
  const navigate = useNavigate();
  return (
    <CompanyDocumentSignerComposition
      companyId={COMPANY_ID}
      basePath="/company-onboarding/documents"
      onComplete={() => navigate("/company-onboarding/overview")}
    />
  );
}
