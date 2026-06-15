import { CenteredPage } from "./shared/CenteredPage/CenteredPage";
import styles from "./AboutDemoPage.module.css";

export function AboutDemoPage() {
  return (
    <CenteredPage>
      <section className={styles.panel}>
        <h1 className={styles.title}>About this demo app</h1>
        <p className={styles.body}>
          This reference app shows how partners can embed core payroll workflows
          with the Gusto Embedded React SDK using route-based examples.
        </p>
        <h2 className={styles.subtitle}>What partners can learn</h2>
        <ul className={styles.list}>
          <li>How to organize separate onboarding and payroll flows in one app.</li>
          <li>How to handle step transitions and navigation events from SDK components.</li>
          <li>How to use these demo patterns as a starting point for production integrations.</li>
        </ul>
      </section>
    </CenteredPage>
  );
}
