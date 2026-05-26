import { useState } from "react";
import styles from "./css/FileInput.module.css";
import { FaFileAlt } from "react-icons/fa";
import {
  type Dictionary,
  type Pairs,
  type Tokens,
  type checkResponse,
  type OneHot,
} from "../types/backendReturns";

type props = {
  fileRef: any;
  setOneHot: React.Dispatch<React.SetStateAction<OneHot>>;
  setPairs: React.Dispatch<React.SetStateAction<Pairs[]>>;
  setWordToIndex: React.Dispatch<React.SetStateAction<Dictionary>>;
  setIdf: React.Dispatch<React.SetStateAction<Dictionary[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTokens: React.Dispatch<React.SetStateAction<Tokens>>;
};
export default function FileInput({
  fileRef,
  setOneHot,
  setPairs,
  setWordToIndex,
  setIdf,
  setLoading,
  setTokens,
}: props) {
  const [nameFile, setNameFile] = useState("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;
    setLoading(true);
    console.log("Selected file:", fileObj.name);
    setNameFile(fileObj.name);
    const callBackend = async () => {
      const formData = new FormData();
      formData.append("file", fileObj);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/check`, {
          method: "POST",
          body: formData,
        });
        const res = (await response.json()) as checkResponse;
        console.log("Mi data", res);
        setOneHot(res.one_hot);
        setPairs(res.pairs);
        setWordToIndex(res.word_to_index);
        setIdf(res.idf);
        setTokens(res.tokens);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    callBackend();
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
          {nameFile === "" && <h3>Introduce a txt file to extract data</h3>}
          {nameFile !== "" && <h3>Current file: {nameFile}</h3>}
        </div>

        <div className={styles.fileContent}>
          <FaFileAlt className={styles.icon} />
          <div>
            <p>
              The file must contain various paragraphs, each one must be
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
