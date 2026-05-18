import { type ReactNode } from "react";
import styles from "./css/Pairs.module.css";
import { MyTable } from "./index";

type props = {
  pairs: any;
};
export default function Pairs({ pairs }: props) {
  function buildPairsT(): ReactNode {
    const tableHeader = (
      <thead>
        <tr>
          <th>Word 1</th>
          <th>Word 2</th>
        </tr>
      </thead>
    );
    const bodyContend = pairs.map((pair: string[], index: number) => (
      <tr key={index}>
        <td>{pair[0]}</td>
        <td>{pair[1]}</td>
      </tr>
    ));
    return (
      <MyTable>
        {tableHeader}
        <tbody>{bodyContend}</tbody>
      </MyTable>
    );
  }
  return (
    <div className={styles.pairs}>
      <h2 className={styles.pairsHeader}>Pairs</h2>
      <>{buildPairsT()}</>
    </div>
  );
}
