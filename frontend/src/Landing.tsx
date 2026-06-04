import { Link } from "react-router-dom";
import styles from "./Landing.module.css";

type Card = {
  to: string;
  title: string;
  description: string;
};

const cards: Card[] = [
  {
    to: "/company-onboarding",
    title: "Company onboarding",
    description: "Walk through setting up a brand new company on Gusto.",
  },
  {
    to: "/run-payroll",
    title: "Onboarded company",
    description: "Manage an already onboarded company — run payroll, pay people, manage settings.",
  },
  {
    to: "/employee-self-onboarding",
    title: "Employee self onboarding",
    description: "Let an employee complete their own onboarding tasks.",
  },
];

export function Landing() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Gusto Embedded SDK Reference</h1>
        <p className={styles.subtitle}>Choose a flow to explore.</p>
        <div className={styles.grid}>
          {cards.map((card) => (
            <Link key={card.to} to={card.to} className={styles.card}>
              <span className={styles.cardTitle}>{card.title}</span>
              <span className={styles.cardDescription}>{card.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
