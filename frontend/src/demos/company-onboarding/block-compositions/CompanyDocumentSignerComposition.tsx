import {
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { CompanyOnboarding, componentEvents } from "@gusto/embedded-react-sdk";
import styles from "./CompanyDocumentSignerComposition.module.css";

// Fine-grained, two-level rebuild of the company document-signing step, routed so
// each stage owns a URL: document list -> assign signatory -> sign a form.
//
// We always enter on the document list. Its built-in "manage signatories" panel
// (part of CompanyOnboarding.DocumentList) prompts to *assign* a signatory when
// none exists and to *change* one when it does, both emitting
// COMPANY_FORM_EDIT_SIGNATORY - so the list itself decides whether the assign
// step is needed and we never have to fetch signatories to pick an entry point.
//
// Level up for less control:
//   - Whole flow: render <CompanyOnboarding.DocumentSigner /> instead - it
//     composes these same sub-blocks (assign signatory -> list -> signing)
//     behind its own internal flow.
//   - Assign step only: render <CompanyOnboarding.AssignSignatory />, which
//     presents the create/invite selection plus both forms. We expand it into a
//     two-tab create/invite UI here purely to show the underlying sub-blocks.

type CompanyDocumentSignerCompositionProps = {
  companyId: string;
  /** Absolute path this composition is mounted at, used for sub-route navigation. */
  basePath: string;
  /** Called when the partner signs all required forms (COMPANY_FORMS_DONE). */
  onComplete: () => void;
};

export function CompanyDocumentSignerComposition({
  companyId,
  basePath,
  onComplete,
}: CompanyDocumentSignerCompositionProps) {
  const navigate = useNavigate();
  const toDocuments = () => navigate(`${basePath}/documents`);

  return (
    <Routes>
      <Route index element={<Navigate to={`${basePath}/documents`} replace />} />
      <Route path="assign" element={<AssignSignatoryTabs />}>
        <Route index element={<Navigate to="create" replace />} />
        <Route
          path="create"
          element={<CreateSignatoryStep companyId={companyId} onAssigned={toDocuments} />}
        />
        <Route
          path="invite"
          element={<InviteSignatoryStep companyId={companyId} onAssigned={toDocuments} />}
        />
      </Route>
      <Route
        path="documents"
        element={
          <CompanyOnboarding.DocumentList
            companyId={companyId}
            onEvent={(type, payload) => {
              switch (type) {
                case componentEvents.COMPANY_VIEW_FORM_TO_SIGN: {
                  const { uuid } = payload as { uuid: string };
                  navigate(`${basePath}/sign/${uuid}`);
                  break;
                }
                case componentEvents.COMPANY_FORM_EDIT_SIGNATORY:
                  navigate(`${basePath}/assign`);
                  break;
                case componentEvents.COMPANY_FORMS_DONE:
                  onComplete();
                  break;
              }
            }}
          />
        }
      />
      <Route
        path="sign/:formId"
        element={<SignFormStep companyId={companyId} onDone={toDocuments} />}
      />
    </Routes>
  );
}

// The assign step itself decomposes into the two ways to assign a signatory.
// Render <CompanyOnboarding.AssignSignatory /> to get this selection + both forms
// in a single block. We expand it into two routed tabs (create / invite) here,
// each owning a URL, purely to show the underlying sub-blocks.
const ASSIGN_TABS = [
  { to: "create", label: "Create signatory" },
  { to: "invite", label: "Invite signatory" },
];

function AssignSignatoryTabs() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab;

  return (
    <div className={styles.layout}>
      <nav className={styles.tabs} aria-label="Assign a signatory">
        {ASSIGN_TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} className={linkClass}>
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}

// Pass CreateSignatory an optional `signatoryId` to switch it to update mode;
// without it (as in this demo) it always creates. Get the id from the signatories
// endpoint:
// https://docs.gusto.com/embedded-payroll/reference/get-v1-companies-company_uuid-signatories
function CreateSignatoryStep({
  companyId,
  onAssigned,
}: {
  companyId: string;
  onAssigned: () => void;
}) {
  return (
    <CompanyOnboarding.CreateSignatory
      companyId={companyId}
      onEvent={(type) => {
        if (type === componentEvents.COMPANY_CREATE_SIGNATORY_DONE) {
          onAssigned();
        }
      }}
    />
  );
}

function InviteSignatoryStep({
  companyId,
  onAssigned,
}: {
  companyId: string;
  onAssigned: () => void;
}) {
  return (
    <CompanyOnboarding.InviteSignatory
      companyId={companyId}
      onEvent={(type) => {
        if (type === componentEvents.COMPANY_INVITE_SIGNATORY_DONE) {
          onAssigned();
        }
      }}
    />
  );
}

function SignFormStep({
  companyId,
  onDone,
}: {
  companyId: string;
  onDone: () => void;
}) {
  const { formId } = useParams<"formId">();
  return (
    <CompanyOnboarding.SignatureForm
      companyId={companyId}
      formId={formId!}
      onEvent={(type) => {
        if (
          type === componentEvents.COMPANY_SIGN_FORM_DONE ||
          type === componentEvents.COMPANY_SIGN_FORM_BACK
        ) {
          onDone();
        }
      }}
    />
  );
}
