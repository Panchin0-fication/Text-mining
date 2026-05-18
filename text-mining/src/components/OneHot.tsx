import { type ReactNode } from "react";
import { MyTable } from "./index";
import styles from "./css/OneHot.module.css";
type props = {
  oneHot: any;
};
export default function OneHot({ oneHot }: props) {
  function buildOneHotT(): ReactNode {
    const keys = Object.keys(oneHot);
    const ths = keys.map((column) => <th key={column}>{column}</th>);
    const tableHeader = (
      <thead>
        <tr>{ths}</tr>
      </thead>
    );

    var allRows = [];
    for (var i = 0; i < keys.length; i++) {
      var row = [];
      for (const key of keys) {
        row.push(<td key={i + key}>{oneHot[key][i]}</td>);
      }
      allRows.push(<tr key={i}>{row}</tr>);
    }
    return (
      <MyTable>
        {tableHeader}
        <tbody>{allRows}</tbody>
      </MyTable>
    );
  }
  return (
    <>
      <h2 className={styles.header}>One Hot Encoding</h2>
      <>{buildOneHotT()}</>
    </>
  );
}
