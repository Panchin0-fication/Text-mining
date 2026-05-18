import { type ReactNode } from "react";
import styles from "./css/MyTable.module.css";

type props = {
  children: ReactNode;
};
export default function MyTable({ children }: props) {
  return (
    <div className={styles.tableCon}>
      <table>{children}</table>
    </div>
  );
}
