import { Employee, Company, GustoProvider } from "@gusto/embedded-react-sdk";
import "@gusto/embedded-react-sdk/style.css";
import "./App.css";

function App() {
  return (
    <GustoProvider config={{ baseUrl: "http://localhost:3001" }}>
      {/* Place any SDK components inside of the GustoProvider here */}
      <Company.OnboardingFlow
        companyId="91b95861-9a2b-4f3e-afe7-92d57056449c" // Replace with your company ID
        onEvent={(eventType, eventPayload) => {
          console.log("eventType", eventType);
          console.log("eventPayload", eventPayload);
        }}
      />
      {/* Usage for employee onboarding flow, uncomment and replace companyId with your company ID to use */}
      {/* <Employee.OnboardingFlow
        companyId="your-company-id-here" // Replace with your company ID
        onEvent={(eventType, eventPayload) => {
          console.log("eventType", eventType);
          console.log("eventPayload", eventPayload);
        }}
      /> */}
    </GustoProvider>
  );
}

export default App;
