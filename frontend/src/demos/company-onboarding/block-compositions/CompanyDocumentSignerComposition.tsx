import { useRef } from "react";
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

// Fine-grained rebuild of the company document-signing step from its sub-blocks
// (DocumentList -> CreateSignatory / InviteSignatory -> SignatureForm), routed so
// each stage owns a URL. If you don't need this control, render
// <CompanyOnboarding.DocumentSigner /> instead - it composes these same sub-blocks
// behind its own internal flow.
//
// The assign step splits <CompanyOnboarding.AssignSignatory /> into two tabs
// (create / invite) here to expose its underlying sub-blocks.

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
  return (
    <Routes>
      <Route index element={<Navigate to={`${basePath}/documents`} replace />} />
      <Route path="assign" element={<AssignSignatoryTabs />}>
        <Route index element={<Navigate to="create" replace />} />
        <Route
          path="create"
          element={<CreateSignatoryStep companyId={companyId} basePath={basePath} />}
        />
        <Route
          path="invite"
          element={<InviteSignatoryStep companyId={companyId} basePath={basePath} />}
        />
      </Route>
      {/* The signatory id rides in the URL (rather than React state) so each stage
          still owns its URL and the id survives the sign round-trip. It is absent
          until a signatory is created in this session. */}
      <Route
        path="documents/:signatoryId?"
        element={
          <DocumentsStep companyId={companyId} basePath={basePath} onComplete={onComplete} />
        }
      />
      <Route
        path="sign/:signatoryId/:formId"
        element={<SignFormStep companyId={companyId} basePath={basePath} />}
      />
    </Routes>
  );
}

// DocumentList only lets the current user sign when its `signatoryId` matches the
// company's saved signatory (it treats them as the "self signatory"). We read that
// id from the route and pass it down so the demo user can sign the forms
// end-to-end; a production app would set it based on who is actually signing.
function DocumentsStep({
  companyId,
  basePath,
  onComplete,
}: {
  companyId: string;
  basePath: string;
  onComplete: () => void;
}) {
  const navigate = useNavigate();
  const { signatoryId } = useParams<"signatoryId">();

  return (
    <CompanyOnboarding.DocumentList
      companyId={companyId}
      signatoryId={signatoryId}
      onEvent={(type, payload) => {
        switch (type) {
          case componentEvents.COMPANY_VIEW_FORM_TO_SIGN: {
            const { uuid } = payload as { uuid: string };
            // Keep the signatory id in the URL so signing stays enabled when we
            // return to the list.
            navigate(`${basePath}/sign/${signatoryId}/${uuid}`);
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

// CreateSignatory decides create vs update internally: pass it an optional
// `signatoryId` and it pre-fills and updates that signatory; omit it (as in this
// demo) and it always creates. To run it in update mode you'd supply an id from
// the signatories endpoint:
// https://docs.gusto.com/embedded-payroll/reference/get-v1-companies-company_uuid-signatories
//
// We keep it in create mode here, but capture the new signatory's id from
// COMPANY_SIGNATORY_CREATED and carry it into the document-list URL so the demo
// user (the self signatory) can sign.
function CreateSignatoryStep({
  companyId,
  basePath,
}: {
  companyId: string;
  basePath: string;
}) {
  const navigate = useNavigate();
  // Captured on COMPANY_SIGNATORY_CREATED, applied when the flow completes.
  const createdSignatoryId = useRef<string>(undefined);

  return (
    <CompanyOnboarding.CreateSignatory
      companyId={companyId}
      onEvent={(type, payload) => {
        if (type === componentEvents.COMPANY_SIGNATORY_CREATED) {
          const { uuid } = payload as { uuid: string };
          createdSignatoryId.current = uuid;
        }
        if (type === componentEvents.COMPANY_CREATE_SIGNATORY_DONE) {
          const id = createdSignatoryId.current;
          navigate(id ? `${basePath}/documents/${id}` : `${basePath}/documents`);
        }
      }}
    />
  );
}

function InviteSignatoryStep({
  companyId,
  basePath,
}: {
  companyId: string;
  basePath: string;
}) {
  const navigate = useNavigate();
  return (
    <CompanyOnboarding.InviteSignatory
      companyId={companyId}
      onEvent={(type) => {
        if (type === componentEvents.COMPANY_INVITE_SIGNATORY_DONE) {
          // An invited signatory signs via their own emailed link, so the demo
          // user is not the self signatory - return to the list without an id.
          navigate(`${basePath}/documents`);
        }
      }}
    />
  );
}

function SignFormStep({
  companyId,
  basePath,
}: {
  companyId: string;
  basePath: string;
}) {
  const navigate = useNavigate();
  const { signatoryId, formId } = useParams<"signatoryId" | "formId">();
  return (
    <CompanyOnboarding.SignatureForm
      companyId={companyId}
      formId={formId!}
      onEvent={(type) => {
        if (
          type === componentEvents.COMPANY_SIGN_FORM_DONE ||
          type === componentEvents.COMPANY_SIGN_FORM_BACK
        ) {
          navigate(`${basePath}/documents/${signatoryId}`);
        }
      }}
    />
  );
}
