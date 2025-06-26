import {
  EmployeeOnboardingFlow,
  GustoApiProvider,
} from "@gusto/embedded-react-sdk";
import "@gusto/embedded-react-sdk/style.css";
import "./App.css";

function App() {
  return (
    <GustoApiProvider config={{ baseUrl: "http://localhost:3001" }}>
      {/* Place any SDK components here */}
      <EmployeeOnboardingFlow
        companyId="{{companyId}}" // Replace with your company ID
        onEvent={(eventType, eventPayload) => {
          console.log("eventType", eventType);
          console.log("eventPayload", eventPayload);
        }}
      />
    </GustoApiProvider>
  );
}

export default App;
