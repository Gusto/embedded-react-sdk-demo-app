import {
  EmployeeSelfOnboardingFlow,
  Company,
  GustoApiProvider,
  EmployeeOnboardingFlow,
} from "@gusto/embedded-react-sdk";
import "@gusto/embedded-react-sdk/style.css";
import "./App.css";

function App() {
  return (
    <GustoApiProvider config={{ baseUrl: "http://localhost:3001" }}>
      <EmployeeSelfOnboardingFlow
        companyId="8c9e2c0e-35f9-4160-aba2-ee4084f477d1"
        employeeId="5972d9b4-957b-4a83-b327-123c9eccac67"
        onEvent={(eventType, eventPayload) => {
          console.log("eventType", eventType);
          console.log("eventPayload", eventPayload);
        }}
      />
    </GustoApiProvider>
  );
}

export default App;
