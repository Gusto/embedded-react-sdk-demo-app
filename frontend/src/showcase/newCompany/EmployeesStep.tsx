import { Employee, componentEvents } from "@gusto/embedded-react-sdk";
import { useEffect, useState } from "react";
import { useDemoSession } from "../DemoSession";
import { EmployeeOnboardingBlocks } from "./EmployeeOnboardingBlocks";
import { Modal } from "./Modal";

interface EmployeesStepProps {
  companyUuid: string;
  onSkip: () => void;
  onCompleted: (addedAny: boolean) => void;
}

type ModalState =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; employeeId: string };

export function EmployeesStep({
  companyUuid,
  onSkip,
  onCompleted,
}: EmployeesStepProps) {
  const { apiBaseUrl } = useDemoSession();
  const [hasEmployees, setHasEmployees] = useState<boolean | null>(null);
  const [modal, setModal] = useState<ModalState>({ kind: "closed" });
  const [refreshKey, setRefreshKey] = useState(0);

  // Probe the company for employees so we can decide between the
  // decision card (no employees yet) and the SDK's employee list.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(
          `${apiBaseUrl}/v1/companies/${companyUuid}/employees`
        );
        const list = response.ok ? ((await response.json()) as unknown[]) : [];
        if (!cancelled) setHasEmployees(list.length > 0);
      } catch {
        if (!cancelled) setHasEmployees(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, companyUuid, refreshKey]);

  if (hasEmployees === null) {
    return (
      <p className="m-0 text-sm text-neutral-500">Loading employees…</p>
    );
  }

  return (
    <>
      {hasEmployees ? (
        <Employee.EmployeeList
          companyId={companyUuid}
          onEvent={(eventType, payload) => {
            if (eventType === componentEvents.EMPLOYEE_CREATE) {
              setModal({ kind: "create" });
              return;
            }
            if (eventType === componentEvents.EMPLOYEE_UPDATE) {
              const data = payload as { employeeId?: string } | undefined;
              if (data?.employeeId) {
                setModal({ kind: "edit", employeeId: data.employeeId });
              }
              return;
            }
            if (eventType === componentEvents.EMPLOYEE_DELETED) {
              setRefreshKey((k) => k + 1);
              return;
            }
            if (eventType === componentEvents.EMPLOYEE_ONBOARDING_DONE) {
              onCompleted(true);
            }
          }}
        />
      ) : (
        <DecisionCard
          title="Want to add employees now?"
          body="You can add employees here, or come back to it later from your dashboard. We won't run payroll until your team is set up."
          addLabel="Add an employee"
          skipLabel="I'll do this later"
          onAdd={() => setModal({ kind: "create" })}
          onSkip={onSkip}
        />
      )}
      {modal.kind !== "closed" ? (
        <Modal
          title={modal.kind === "create" ? "Add an employee" : "Resume onboarding"}
          onClose={() => setModal({ kind: "closed" })}
        >
          <EmployeeOnboardingBlocks
            companyUuid={companyUuid}
            initialEmployeeId={
              modal.kind === "edit" ? modal.employeeId : undefined
            }
            onDone={() => {
              setModal({ kind: "closed" });
              setRefreshKey((k) => k + 1);
            }}
          />
        </Modal>
      ) : null}
    </>
  );
}

function DecisionCard({
  title,
  body,
  addLabel,
  skipLabel,
  onAdd,
  onSkip,
}: {
  title: string;
  body: string;
  addLabel: string;
  skipLabel: string;
  onAdd: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-8">
      <h2 className="m-0 text-2xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h2>
      <p className="m-0 text-base leading-relaxed text-neutral-600">{body}</p>
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-indigo-500/40"
        >
          {addLabel}
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
        >
          {skipLabel}
        </button>
      </div>
    </div>
  );
}
