import { Employee } from "@gusto/embedded-react-sdk";

export function Nav2Page() {
  return (
    <div className="flex flex-col gap-3">
      <Employee.Profile companyId="91b95861-9a2b-4f3e-afe7-92d57056449c" // Replace with your company ID
        onEvent={(eventType, eventPayload) => {
          console.log("eventType", eventType);
          console.log("eventPayload", eventPayload);
        }}
      />
    </div>
  );
}
