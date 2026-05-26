import { useState, type ReactNode } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { useTheme } from "../sdk/themeContext";
import { useApiHealth } from "../sdk/useApiHealth";
import type { Example, Mode } from "./types";

export interface CodeFile {
  name: string;
  source: string;
}

interface ExampleLayoutProps {
  mode: Mode;
  example: Example;
  /** Source files for this example. If provided, a Code tab is rendered. */
  code?: CodeFile[];
  children: ReactNode;
}

const modeLabels: Record<Mode, string> = {
  workflows: "Workflows",
  blocks: "Blocks",
  hooks: "Hooks",
};

type ActiveTab = "preview" | "code";

export function ExampleLayout({
  mode,
  example,
  code,
  children,
}: ExampleLayoutProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("preview");
  const [activeFile, setActiveFile] = useState(0);
  const hasCode = !!code?.length;
  const health = useApiHealth();

  return (
    <div className="flex flex-col gap-8">
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-[#E15A43]">
          {modeLabels[mode]} · Example
        </p>
        <h1 className="m-0 text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {example.label}
        </h1>
        <p className="m-0 max-w-3xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          {example.summary}
        </p>
        <p className="m-0 max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {example.description}
        </p>
        {example.sdkPrimitives.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {example.sdkPrimitives.map((primitive) => (
              <span
                key={primitive}
                className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 font-mono text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
              >
                {primitive}
              </span>
            ))}
          </div>
        ) : null}
      </header>
      <div className="-mx-6 border-t border-neutral-200 dark:border-neutral-800" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800">
          <TabButton
            label="Preview"
            active={activeTab === "preview"}
            onClick={() => setActiveTab("preview")}
          />
          {hasCode ? (
            <TabButton
              label="Code"
              active={activeTab === "code"}
              onClick={() => setActiveTab("code")}
            />
          ) : null}
        </div>
        {activeTab === "preview" || !hasCode ? (
          health.state === "ok" || health.state === "loading" ? (
            children
          ) : (
            <ConfigReminder
              state={health.state}
              reason={health.reason}
            />
          )
        ) : (
          <CodePanel
            files={code!}
            activeFile={activeFile}
            onSelectFile={setActiveFile}
          />
        )}
      </div>
    </div>
  );
}

function ConfigReminder({
  state,
  reason,
}: {
  state: "not-configured" | "unreachable";
  reason?: string;
}) {
  const title =
    state === "unreachable"
      ? "Can't reach the backend"
      : "Backend isn't configured yet";
  const intro =
    state === "unreachable"
      ? "The frontend couldn't talk to the proxy at http://localhost:3001. Start it before you can run the SDK examples."
      : "The proxy is running but missing credentials. Set these up and restart the backend.";

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-amber-300 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/30">
      <div className="flex flex-col gap-2">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
          Setup required
        </p>
        <h3 className="m-0 text-xl font-semibold tracking-tight text-amber-900 dark:text-amber-100">
          {title}
        </h3>
        <p className="m-0 text-sm leading-relaxed text-amber-900/80 dark:text-amber-200/80">
          {intro}
        </p>
      </div>
      <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 text-sm text-amber-900/80 dark:text-amber-200/80">
        <li>
          Copy{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900/40">
            backend/.env.example
          </code>{" "}
          to{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900/40">
            backend/.env
          </code>{" "}
          and set <code className="font-mono text-xs">CLIENT_ID</code> +{" "}
          <code className="font-mono text-xs">CLIENT_SECRET</code>.
        </li>
        <li>
          Copy{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900/40">
            backend/tokens.example.json
          </code>{" "}
          to{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900/40">
            backend/tokens.json
          </code>{" "}
          and paste in your <code className="font-mono text-xs">refresh_token</code>.
        </li>
        <li>
          Restart the backend (<code className="font-mono text-xs">cd backend && npm run dev</code>) and reload this page.
        </li>
      </ol>
      {reason ? (
        <p className="m-0 rounded-md bg-amber-100 px-3 py-2 font-mono text-xs text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
          {reason}
        </p>
      ) : null}
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative -mb-px cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-b-2 border-blue-500 text-neutral-900 dark:border-[#E15A43] dark:text-neutral-100"
          : "border-b-2 border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      }`}
    >
      {label}
    </button>
  );
}

function CodePanel({
  files,
  activeFile,
  onSelectFile,
}: {
  files: CodeFile[];
  activeFile: number;
  onSelectFile: (i: number) => void;
}) {
  const file = files[activeFile];
  const { resolvedTheme } = useTheme();
  const prismTheme =
    resolvedTheme === "dark" ? themes.oneDark : themes.oneLight;

  return (
    <div className="flex flex-col gap-3">
      {files.length > 1 ? (
        <div className="flex flex-wrap items-center gap-1">
          {files.map((f, i) => (
            <button
              key={f.name}
              type="button"
              onClick={() => onSelectFile(i)}
              className={`cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                i === activeFile
                  ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      ) : null}
      <Highlight
        code={file.source.trimEnd()}
        language="tsx"
        theme={prismTheme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} rounded-xl border border-neutral-200 p-5 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word dark:border-neutral-800`}
            style={
              resolvedTheme === "dark"
                ? { ...style, backgroundColor: "#171717" }
                : style
            }
          >
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line });
              return (
                <div key={i} {...lineProps} className="flex">
                  <span className="mr-4 inline-block w-6 shrink-0 text-right text-neutral-500 select-none">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
