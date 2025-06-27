import { Employee, Company, GustoProvider } from "@gusto/embedded-react-sdk";
import "@gusto/embedded-react-sdk/style.css";
import "./App.css";

function App() {
  return (
    <GustoProvider config={{ baseUrl: "http://localhost:3001" }}>
      {/* Place any SDK components inside of the GustoProvider here */}
      <Company.OnboardingFlow
        companyId="your-company-id-here" // Replace with your company ID
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
