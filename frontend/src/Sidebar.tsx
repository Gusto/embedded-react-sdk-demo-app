import type { Domain } from "./domains/types";
import { exampleKey } from "./exampleKey";

type Props = {
  domains: Domain[];
  activeKey: string;
  onSelect: (key: string) => void;
};

export default function Sidebar({ domains, activeKey, onSelect }: Props) {
  return (
    <nav className="sidebar">
      {domains.map((domain) => (
        <div key={domain.name} className="sidebar-domain">
          <h2 className="sidebar-domain-name">{domain.name}</h2>
          <ul className="sidebar-list">
            {domain.examples.map((entry) => {
              if ("children" in entry) {
                return (
                  <li key={entry.name}>
                    <span className="sidebar-group-name">{entry.name}</span>
                    <ul className="sidebar-list sidebar-list-nested">
                      {entry.children.map((child) => {
                        const key = exampleKey(domain.name, entry.name, child.name);
                        return (
                          <li key={key}>
                            <button
                              type="button"
                              className={
                                "sidebar-link" +
                                (key === activeKey ? " sidebar-link-active" : "")
                              }
                              onClick={() => onSelect(key)}
                            >
                              {child.name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }

              const key = exampleKey(domain.name, entry.name);
              return (
                <li key={key}>
                  <button
                    type="button"
                    className={
                      "sidebar-link" +
                      (key === activeKey ? " sidebar-link-active" : "")
                    }
                    onClick={() => onSelect(key)}
                  >
                    {entry.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
