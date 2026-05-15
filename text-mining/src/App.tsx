import "./App.css";
import { useEffect, useRef } from "react";
import { HeaderAndInfo, FileInput } from "./components/index";

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
  return (
    <div className="body">
      <HeaderAndInfo />
      <FileInput fileRef={fileRef} />
      {/*Call backend test */}
    </div>
  );
}

export default App;
