import { Link, NavLink, Outlet } from "react-router-dom";
import styles from "./DashboardTabs.module.css";

const TABS = [
  { to: "basic-details", label: "Basic details" },
  { to: "job-and-pay", label: "Job and pay" },
  { to: "taxes", label: "Taxes" },
  { to: "documents", label: "Documents" },
];

export function DashboardTabs() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab;

  return (
    <div className={styles.layout}>
      <Link to="/employees" className={styles.backLink}>
        <span aria-hidden="true">&larr;</span>Back to employees
      </Link>
      <nav className={styles.tabs} aria-label="Employee management">
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} className={linkClass}>
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
