import { useState, type ReactNode } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import styles from "./css/Lookup.module.css";
import { type Tokens, type OneHot } from "../types/backendReturns";

type props = {
  oneHot: OneHot;
  tokens: Tokens;
};
export default function Lookup({ oneHot, tokens }: props) {
  const [lookup, setLookup] = useState("");
  const [message, setMessage] = useState<undefined | ReactNode>();

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
    //formData.append("all_tokens", tokens);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/lookup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          one_hot_token,
          all_tokens: tokens,
        }),
      });
      const res = await response.json();
      setMessage(
        <div className={styles.flexDiv}>
          <FaCheck />
          <p>Related word: {res.fount_word}</p>
        </div>,
      );
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className={styles.lookup}>
      <h2>Semantic lookup</h2>
      <p>Search a word (from the abilable vocabulary) to look for relations </p>
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

      {message}
    </div>
  );
}
