import { useState } from "react";
import { GustoProvider } from "@gusto/embedded-react-sdk";
import "@gusto/embedded-react-sdk/style.css";
import "./App.css";
import { BASE_URL } from "./config";
import EmployeeOnboarding from "./domains/EmployeeOnboarding";
import Sidebar from "./Sidebar";
import { exampleKey } from "./exampleKey";
import type { Domain, Example } from "./domains/types";

const domains: Domain[] = [EmployeeOnboarding];

// Build a flat lookup of every example keyed by its sidebar key.
const examplesByKey = new Map<string, Example>();
for (const domain of domains) {
  for (const entry of domain.examples) {
    if ("children" in entry) {
      for (const child of entry.children) {
        examplesByKey.set(
          exampleKey(domain.name, entry.name, child.name),
          child
        );
      }
    } else {
      examplesByKey.set(exampleKey(domain.name, entry.name), entry);
    }
  }
}

const defaultKey = examplesByKey.keys().next().value!;

function App() {
  const [activeKey, setActiveKey] = useState<string>(defaultKey);
  const ActiveExample = examplesByKey.get(activeKey)?.component;

  return (
    <GustoProvider config={{ baseUrl: BASE_URL }}>
      <div className="app">
        <Sidebar
          domains={domains}
          activeKey={activeKey}
          onSelect={setActiveKey}
        />
        <main className="canvas">{ActiveExample && <ActiveExample />}</main>
      </div>
    </GustoProvider>
  );
}

export default App;
