import { EmployeeOnboarding } from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../config";

export default function Flow() {
  return (
    <EmployeeOnboarding.OnboardingFlow
      companyId={COMPANY_ID}
      onEvent={() => {}}
    />
  );
}
