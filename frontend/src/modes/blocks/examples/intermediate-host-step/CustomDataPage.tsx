import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../toast/ToastProvider";

export function CustomDataPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [badgeId, setBadgeId] = useState("");
  const [lockerNumber, setLockerNumber] = useState("");

  if (!employeeId) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <p className="m-0 text-sm text-neutral-600 dark:text-neutral-400">
        Step 2 of 3 — collect data unique to your application that Gusto
        doesn't store. This is pure host UI (no SDK component) inserted
        between two SDK steps.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast({
            title: "host:internal-record-saved",
            description: (
              <>
                Saved internal record for employee id ={" "}
                <span className="font-mono text-xs">{employeeId}</span>
              </>
            ),
          });
          navigate(`/blocks/intermediate-host-step/done/${employeeId}`);
        }}
        className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <p className="m-0 text-xs text-neutral-500 dark:text-neutral-400">
          Employee id: <span className="font-mono">{employeeId}</span>
        </p>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Badge ID
          <input
            type="text"
            required
            value={badgeId}
            onChange={(e) => setBadgeId(e.target.value)}
            className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="e.g. A-1042"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Locker number
          <input
            type="text"
            required
            value={lockerNumber}
            onChange={(e) => setLockerNumber(e.target.value)}
            className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="e.g. 217"
          />
        </label>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
          >
            Save and continue
          </button>
        </div>
      </form>
    </div>
  );
}
