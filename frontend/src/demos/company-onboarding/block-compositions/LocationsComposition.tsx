import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { CompanyOnboarding, componentEvents } from "@gusto/embedded-react-sdk";

// Fine-grained rebuild of the locations step from its two sub-blocks
// (CompanyOnboarding.LocationsList + CompanyOnboarding.LocationForm), routed so
// the list and the add/edit form each own a URL. If you don't need this control,
// render <CompanyOnboarding.Locations /> instead - it composes these same
// sub-blocks behind its own internal list<->form flow.

type LocationsCompositionProps = {
  companyId: string;
  /** Absolute path this composition is mounted at, used for sub-route navigation. */
  basePath: string;
  /** Called when the partner finishes the locations step (COMPANY_LOCATION_DONE). */
  onComplete: () => void;
};

export function LocationsComposition({
  companyId,
  basePath,
  onComplete,
}: LocationsCompositionProps) {
  const navigate = useNavigate();
  const toList = () => navigate(basePath);

  return (
    <Routes>
      <Route
        index
        element={
          <CompanyOnboarding.LocationsList
            companyId={companyId}
            onEvent={(type, payload) => {
              switch (type) {
                case componentEvents.COMPANY_LOCATION_CREATE:
                  navigate(`${basePath}/new`);
                  break;
                case componentEvents.COMPANY_LOCATION_EDIT: {
                  const { uuid } = payload as { uuid: string };
                  navigate(`${basePath}/edit/${uuid}`);
                  break;
                }
                case componentEvents.COMPANY_LOCATION_DONE:
                  onComplete();
                  break;
              }
            }}
          />
        }
      />
      <Route path="new" element={<LocationFormStep companyId={companyId} onDone={toList} />} />
      <Route
        path="edit/:locationId"
        element={<LocationFormStep companyId={companyId} onDone={toList} />}
      />
    </Routes>
  );
}

function LocationFormStep({
  companyId,
  onDone,
}: {
  companyId: string;
  onDone: () => void;
}) {
  const { locationId } = useParams<"locationId">();
  return (
    <CompanyOnboarding.LocationForm
      companyId={companyId}
      locationId={locationId}
      onEvent={(type) => {
        if (
          type === componentEvents.COMPANY_LOCATION_CREATED ||
          type === componentEvents.COMPANY_LOCATION_UPDATED ||
          type === componentEvents.CANCEL
        ) {
          onDone();
        }
      }}
    />
  );
}
