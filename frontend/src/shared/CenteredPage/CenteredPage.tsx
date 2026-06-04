import type { ReactNode } from "react";
import styles from "./CenteredPage.module.css";

type Props = {
  children: ReactNode;
};

export function CenteredPage({ children }: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
