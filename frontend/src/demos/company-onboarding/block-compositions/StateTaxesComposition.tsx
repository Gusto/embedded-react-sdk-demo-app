import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { CompanyOnboarding, componentEvents } from "@gusto/embedded-react-sdk";

// Fine-grained rebuild of the state-taxes step from its two sub-blocks
// (CompanyOnboarding.StateTaxesList + CompanyOnboarding.StateTaxesForm), routed
// so the list and the per-state edit form each own a URL. If you don't need this
// control, render <CompanyOnboarding.StateTaxes /> instead - it composes these
// same sub-blocks behind its own internal list<->form flow.

type StateTaxesCompositionProps = {
  companyId: string;
  /** Absolute path this composition is mounted at, used for sub-route navigation. */
  basePath: string;
  /** Called when the partner finishes the state-taxes step (COMPANY_STATE_TAX_DONE). */
  onComplete: () => void;
};

export function StateTaxesComposition({
  companyId,
  basePath,
  onComplete,
}: StateTaxesCompositionProps) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        index
        element={
          <CompanyOnboarding.StateTaxesList
            companyId={companyId}
            onEvent={(type, payload) => {
              switch (type) {
                case componentEvents.COMPANY_STATE_TAX_EDIT: {
                  const { state } = payload as { state: string };
                  navigate(`${basePath}/edit/${state}`);
                  break;
                }
                case componentEvents.COMPANY_STATE_TAX_DONE:
                  onComplete();
                  break;
              }
            }}
          />
        }
      />
      <Route
        path="edit/:state"
        element={
          <StateTaxFormStep companyId={companyId} onDone={() => navigate(basePath)} />
        }
      />
    </Routes>
  );
}

function StateTaxFormStep({
  companyId,
  onDone,
}: {
  companyId: string;
  onDone: () => void;
}) {
  const { state } = useParams<"state">();
  return (
    <CompanyOnboarding.StateTaxesForm
      companyId={companyId}
      state={state!}
      onEvent={(type) => {
        if (
          type === componentEvents.COMPANY_STATE_TAX_UPDATED ||
          type === componentEvents.CANCEL
        ) {
          onDone();
        }
      }}
    />
  );
}
