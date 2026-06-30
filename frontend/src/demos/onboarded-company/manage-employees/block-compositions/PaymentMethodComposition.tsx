import { Route, Routes, useNavigate } from "react-router-dom";
import { EmployeeManagement, componentEvents } from "@gusto/embedded-react-sdk";

/**
 * Fine-grained rebuild of the PaymentMethod management block from its individual
 * sub-components (PaymentMethodCard + PaymentMethodBankForm + PaymentMethodSplitForm),
 * routed so each owns a URL.
 *
 * If you don't need this control, render <EmployeeManagement.PaymentMethod />
 * instead - it composes these same sub-blocks behind its own internal flow.
 *
 * This composition demonstrates:
 * - Using PaymentMethodCard as the main view
 * - Routing to separate forms for add and split actions
 * - Handling all the event-driven navigation between components
 */

type PaymentMethodCompositionProps = {
  employeeId: string;
};

export function PaymentMethodComposition({
  employeeId,
}: PaymentMethodCompositionProps) {
  const navigate = useNavigate();
  const basePath = `/employees/${employeeId}/payment-method-composition`;

  return (
    <Routes>
      <Route
        index
        element={
          <EmployeeManagement.PaymentMethodCard
            employeeId={employeeId}
            onEvent={(type) => {
              switch (type) {
                case componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_CARD_ADD_REQUESTED:
                  navigate(`${basePath}/add`);
                  break;
                case componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_CARD_SPLIT_REQUESTED:
                  navigate(`${basePath}/split`);
                  break;
              }
            }}
          />
        }
      />
      <Route
        path="add"
        element={
          <EmployeeManagement.PaymentMethodBankForm
            employeeId={employeeId}
            onEvent={(type) => {
              if (
                type === componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_BANK_FORM_SUBMITTED ||
                type === componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_BANK_FORM_CANCELLED
              ) {
                navigate(basePath);
              }
            }}
          />
        }
      />
      <Route
        path="split"
        element={
          <EmployeeManagement.PaymentMethodSplitForm
            employeeId={employeeId}
            onEvent={(type) => {
              if (
                type === componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_SPLIT_FORM_SUBMITTED ||
                type === componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_SPLIT_FORM_CANCELLED
              ) {
                navigate(basePath);
              }
            }}
          />
        }
      />
    </Routes>
  );
}
