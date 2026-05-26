import { Company, componentEvents } from "@gusto/embedded-react-sdk";
import { useNavigate } from "react-router-dom";
import { useDemoSession } from "../DemoSession";
import { useCompanyState } from "./useCompanyState";
import { useDemoToast } from "./demoToast";
import { PageHeader } from "./ui";

interface Props {
  companyUuid: string;
}

export function PayrollSettingsSignatory({ companyUuid }: Props) {
  const state = useCompanyState(companyUuid);
  const navigate = useNavigate();
  const { toast } = useDemoToast();
  const { basePath } = useDemoSession();

  return (
    <>
      <PageHeader
        eyebrow="Settings · Signatory"
        title="Signatory"
        description={
          state.hasSignatory
            ? "Update the person authorized to sign your payroll documents."
            : "Assign someone authorized to sign your payroll documents. Once assigned, we'll route you to your documents to sign."
        }
      />
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <Company.CreateSignatory
          companyId={companyUuid}
          onEvent={(eventType) => {
            if (
              eventType === componentEvents.COMPANY_SIGNATORY_CREATED ||
              eventType === componentEvents.COMPANY_CREATE_SIGNATORY_DONE
            ) {
              state.refresh();
              toast("Signatory assigned");
              navigate(`${basePath}/payroll/documents`);
            }
          }}
        />
      </div>
    </>
  );
}
