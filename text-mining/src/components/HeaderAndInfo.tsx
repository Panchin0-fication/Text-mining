import styles from "./css/HeaderAndInfo.module.css";
import { GiMining } from "react-icons/gi";
export default function HeaderAndInfo() {
  return (
    <div className={styles.headerAndInfo}>
      <div className={styles.header}>
        <h1>Text mining</h1>
        <GiMining className={styles.icon} />
      </div>
      <p className={styles.infoPara}>
        This is a project made for the <span>Data Mining</span> class
      </p>
      <div className="deadSpace"></div>
      <p className={styles.infoPara}>
        Select a txt file to mine and look for useful data
      </p>
    </div>
  );
}
