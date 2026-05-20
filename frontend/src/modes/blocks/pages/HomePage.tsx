const accounts = [
  {
    name: "Operating",
    number: "•• 4821",
    balance: 248_392.18,
    delta: "+$12,408 this month",
  },
  {
    name: "Payroll",
    number: "•• 9034",
    balance: 86_140.55,
    delta: "Next run in 4 days",
  },
  {
    name: "Tax reserve",
    number: "•• 1156",
    balance: 41_280.0,
    delta: "Auto-funded weekly",
  },
];

const quickActions = [
  { label: "Send transfer", hint: "ACH or wire" },
  { label: "Run payroll", hint: "Bi-weekly" },
  { label: "Pay contractor", hint: "1099" },
  { label: "Add payee", hint: "Vendor or person" },
];

const activity = [
  {
    id: "t-1",
    date: "Today",
    description: "Payroll — March cycle 2",
    counterparty: "Gusto",
    amount: -42_180.92,
    status: "success" as const,
    statusLabel: "Sent",
  },
  {
    id: "t-2",
    date: "Today",
    description: "Stripe payout",
    counterparty: "Stripe",
    amount: 18_402.55,
    status: "success" as const,
    statusLabel: "Received",
  },
  {
    id: "t-3",
    date: "Yesterday",
    description: "Federal tax withholding",
    counterparty: "IRS EFTPS",
    amount: -9_812.4,
    status: "info" as const,
    statusLabel: "Processing",
  },
  {
    id: "t-4",
    date: "Mar 14",
    description: "Wire to Linear",
    counterparty: "Linear Orbit Inc.",
    amount: -2_400.0,
    status: "success" as const,
    statusLabel: "Sent",
  },
  {
    id: "t-5",
    date: "Mar 13",
    description: "Contractor payment — J. Park",
    counterparty: "Jane Park",
    amount: -3_600.0,
    status: "warning" as const,
    statusLabel: "Pending",
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const chipClassMap = {
  success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
};

const cardClasses =
  "rounded-xl border border-neutral-200 bg-white p-5 transition cursor-pointer hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-black/40";

export function HomePage() {
  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm text-neutral-500 dark:text-neutral-400">
            Good morning, Aaron
          </p>
          <h1 className="m-0 text-4xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-neutral-100">
            {currency.format(total)}
          </h1>
          <p className="m-0 text-sm text-neutral-500 dark:text-neutral-400">
            Total balance across 3 accounts
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 cursor-pointer transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            Move money
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white cursor-pointer transition hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {accounts.map((account) => (
          <div key={account.number} className={cardClasses}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="m-0 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {account.name}
              </h3>
              <p className="m-0 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                {account.number}
              </p>
            </div>
            <p className="m-0 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {currency.format(account.balance)}
            </p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {account.delta}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickActions.map((action) => (
            <div key={action.label} className={`${cardClasses} p-4`}>
              <p className="m-0 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {action.label}
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {action.hint}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <h2 className="m-0 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Recent activity
          </h2>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-transparent px-2 py-1 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            View all
          </button>
        </div>
        {activity.map((txn, i) => {
          const isCredit = txn.amount > 0;
          const isLast = i === activity.length - 1;
          return (
            <div
              key={txn.id}
              className={`grid grid-cols-[80px_1fr_auto_140px] items-center gap-4 px-5 py-3 ${
                isLast
                  ? ""
                  : "border-b border-neutral-100 dark:border-neutral-800"
              }`}
            >
              <p className="m-0 text-sm text-neutral-500 dark:text-neutral-400">
                {txn.date}
              </p>
              <div>
                <p className="m-0 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {txn.description}
                </p>
                <p className="m-0 text-xs text-neutral-500 dark:text-neutral-400">
                  {txn.counterparty}
                </p>
              </div>
              <span
                className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  chipClassMap[txn.status]
                }`}
              >
                {txn.statusLabel}
              </span>
              <p
                className={`m-0 text-right text-sm font-semibold tabular-nums ${
                  isCredit
                    ? "text-green-600 dark:text-green-400"
                    : "text-neutral-900 dark:text-neutral-100"
                }`}
              >
                {isCredit ? "+" : ""}
                {currency.format(txn.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
