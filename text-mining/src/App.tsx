import "./App.css";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { HeaderAndInfo, FileInput, Field, MyTable } from "./components/index";
import { FaArrowRotateRight } from "react-icons/fa6";

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
  const [wordToIndex, setWordToIndex] = useState<any>();
  const [idf, setIdf] = useState<any>();
  const [loading, setLoading] = useState(false);

  //Functions
  function showWordToIndex(): ReactNode {
    const keys = Object.keys(wordToIndex);
    const tableHeader = (
      <thead>
        <tr>
          <th>Word</th>
          <th>Index</th>
        </tr>
      </thead>
    );
    const tableContend = keys.map((element) => (
      <tr key={element + wordToIndex[element]}>
        <td>{element}</td>
        <td>{wordToIndex[element]}</td>
      </tr>
    ));
    return (
      <MyTable>
        {tableHeader}
        <tbody>{tableContend}</tbody>
      </MyTable>
    );
  }
  function showOneHot(): ReactNode {
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
  function showPairs(): ReactNode {
    const tableHeader = (
      <thead>
        <tr>
          <th>Token 1</th>
          <th>Token 2</th>
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
  function showIdf(): ReactNode {
    //Build a table for every
    var AllContend = [];
    for (const element of idf) {
      const header = <h3>Document {AllContend.length + 1}</h3>;
      const tableHeader = (
        <thead>
          <tr>
            <th>Token</th>
            <th>tf idf</th>
          </tr>
        </thead>
      );
      const keys = Object.keys(element);
      const tableBody = keys.map((current) => (
        <tr>
          <td>{current}</td>
          <td>{element[current]}</td>
        </tr>
      ));
      AllContend.push(
        <>
          {header}
          <MyTable>
            {tableHeader}
            <tbody>{tableBody}</tbody>
          </MyTable>
        </>,
      );
    }

    return AllContend;
  }
  return (
    <div className="body">
      <HeaderAndInfo />
      <FileInput
        fileRef={fileRef}
        setOneHot={setOneHot}
        setPairs={setPairs}
        setWordToIndex={setWordToIndex}
        setIdf={setIdf}
        setLoading={setLoading}
      />
      {!loading && (
        <>
          {wordToIndex && (
            <Field
              buildFunction={showWordToIndex}
              fieldHeader={"Vocabulary and Indexation"}
            />
          )}
          {oneHot && (
            <Field buildFunction={showOneHot} fieldHeader="One Hot encoding" />
          )}
          {pairs && <Field buildFunction={showPairs} fieldHeader="Pairs" />}
          {idf && <Field buildFunction={showIdf} fieldHeader="Idf's" />}
        </>
      )}
      {loading && <FaArrowRotateRight className="loader" />}

      <div className="deadSpace"></div>
    </div>
  );
}

export default App;
