import styles from "./css/FileInput.module.css";
import { FaFileAlt } from "react-icons/fa";

type props = {
  fileRef: any;
};
export default function FileInput({ fileRef }: props) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    console.log("Selected file:", fileObj.name);
  };
  return (
    <>
      <div
        className={styles.fileInput}
        onClick={async () => {
          await fileRef.current.click();
        }}
      >
        <div className={styles.header}>
          <h3>Introduce a txt file to extract data</h3>
        </div>

        <div className={styles.fileContent}>
          <FaFileAlt className={styles.icon} />
          <div>
            <p>
              Insert a txt file with various paragraphs, eacht one must be
              separated by an empty row. The language of the text must be in
              Spanish
            </p>
          </div>
        </div>
      </div>
      <input
        onChange={handleFileChange}
        ref={fileRef}
        className={styles.inputFile}
        type="file"
        accept=".txt"
      />
    </>
  );
}
