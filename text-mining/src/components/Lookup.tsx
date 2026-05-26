import { useRef, useState, type ReactNode } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaPython } from "react-icons/fa";
import { MdErrorOutline, MdFileOpen } from "react-icons/md";
import styles from "./css/Lookup.module.css";
import { type Tokens, type OneHot } from "../types/backendReturns";
import { GoDotFill } from "react-icons/go";

type props = {
  oneHot: OneHot;
  tokens: Tokens;
};
export default function Lookup({ oneHot, tokens }: props) {
  const [lookup, setLookup] = useState("");
  const [message, setMessage] = useState<undefined | ReactNode>();
  const useWeigthRef = useRef<any>([]);
  const [weigth, setWeigth] = useState<File>();

  function fileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;
    console.log("Weigth file:", fileObj.name);
    setWeigth(fileObj);
  }

  function downloadFromUrl(url: string, name: string) {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function tokenLookup() {
    //SEARCH TOKEN
    const to_lookup = lookup.toLowerCase().trim();
    var one_hot_token;
    one_hot_token = oneHot[to_lookup];

    if (!one_hot_token) {
      console.log("Token not fount");
      setMessage(
        <div className={styles.flexDiv}>
          <MdErrorOutline />
          <p>That word is not in the vocabulary</p>
        </div>,
      );
      return;
    }
    setMessage(undefined);
    console.log("Token fount", one_hot_token);
    const formData = new FormData();

    formData.append("all_tokens", JSON.stringify(tokens));
    formData.append("token_index", tokens.indexOf(to_lookup).toString());
    formData.append("file", weigth as File);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/lookup`, {
      method: "POST",
      body: formData,
    });
    const res = await response.json();
    if (res.success) {
      setMessage(
        <div className={styles.flexColum}>
          {res.indeces.map((fer: number, index: number) => (
            <div key={String(fer) + String(index)} className={styles.flexDiv}>
              <GoDotFill />
              <p>
                Related word {index + 1}: {tokens[fer]}
              </p>
            </div>
          ))}
        </div>,
      );
    } else {
      setMessage(
        <div className={styles.flexDiv}>
          <MdErrorOutline />
          <p>Error using the weigth file</p>
        </div>,
      );
    }
  }
  return (
    <div className={styles.lookup}>
      <h2>Semantic lookup</h2>
      {!weigth && (
        <>
          <input
            type="file"
            onChange={fileUpload}
            ref={useWeigthRef}
            className={styles.inputFile}
            accept=".npy"
          />
          <p>To look for context/related words insert a input weigth file</p>
          <p>
            Download the file below and use train skip gram to get a input
            weigth file
          </p>
          <p>keep in mind this takes a long time to finish the training</p>
          <div
            className={`${styles.flexDiv} ${styles.clickable}`}
            onClick={() =>
              downloadFromUrl("/code/training.zip", "training.zip")
            }
          >
            <FaPython />
            <p>Download the training code</p>
          </div>
          <div
            className={`${styles.weigthFile} ${styles.flexDiv}`}
            onClick={async () => {
              await useWeigthRef.current.click();
            }}
          >
            <MdFileOpen />
            <p>Input Weight File</p>
          </div>
        </>
      )}

      {weigth && (
        <>
          <p>
            Search a word (from the abilable vocabulary) to look for relations
          </p>
          <div className={styles.flexDiv}>
            <input
              className={styles.input}
              type="text"
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
            />
            <button onClick={tokenLookup} className={styles.lookButton}>
              Search
              <IoMdSearch />
            </button>
          </div>
        </>
      )}
      {message}
    </div>
  );
}
