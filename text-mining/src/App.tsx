import "./App.css";
import { useEffect, useRef, useState } from "react";
import { HeaderAndInfo, FileInput, OneHot, Pairs } from "./components/index";

function App() {
  /*Call backend test  */
  useEffect(() => {
    const callBackend = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/`);
      const res = await response.json();
      console.log(res);
    };
    callBackend();
  }, []);
  const fileRef = useRef<any>([]);
  const [oneHot, setOneHot] = useState<any>();
  const [pairs, setPairs] = useState<any>();

  return (
    <div className="body">
      <HeaderAndInfo />
      <FileInput fileRef={fileRef} setOneHot={setOneHot} setPairs={setPairs} />
      {oneHot && <OneHot oneHot={oneHot} />}
      {pairs && <Pairs pairs={pairs} />}
      <div className="deadSpace"></div>
    </div>
  );
}

export default App;
