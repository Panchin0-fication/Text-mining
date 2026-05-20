import { useState, type ReactNode } from "react";
import { IoArrowDownOutline } from "react-icons/io5";
import styles from "./css/Field.module.css";
type props = {
  buildFunction: () => ReactNode;
  fieldHeader: string;
};
export default function Field({ buildFunction, fieldHeader }: props) {
  const [show, setShow] = useState(true);
  return (
    <div className={styles.field}>
      <div className={styles.fieldHeader}>
        <h2>{fieldHeader}</h2>
        <IoArrowDownOutline
          onClick={() => setShow(!show)}
          className={`${styles.icon} ${show ? styles.rotate : ""}`}
        />
      </div>
      <div style={{ display: show ? "block" : "none" }}>
        <>{buildFunction()}</>
      </div>
    </div>
  );
}
