import type { TabsProps } from "@gusto/embedded-react-sdk";

export function Tabs({
  tabs,
  selectedId,
  onSelectionChange,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: TabsProps) {
  const activeTab = tabs.find((t) => t.id === selectedId) ?? tabs[0];

  return (
    <div className={`flex w-full flex-col gap-6 font-sans ${className ?? ""}`}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="flex gap-6 border-b border-neutral-200 dark:border-neutral-800"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab?.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.isDisabled}
              onClick={() => onSelectionChange(tab.id)}
              className={[
                "-mb-px cursor-pointer border-b-2 px-1 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
                isActive
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab ? (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          className="w-full"
        >
          {activeTab.content}
        </div>
      ) : null}
    </div>
  );
}
