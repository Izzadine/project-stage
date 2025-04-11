import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sparql } from "codemirror-lang-sparql";
import RunNextQueryButton from "./RunNextQueryButton";

interface QueryEditorProps {
  query: string;
  setQuery: (query: string) => void;
  runQuery: () => void;
  loading: boolean;
  nextQuery?: string;
  results?: { metadata?: { next?: string }} |null; // add null because sometimes result is null
}

const QueryEditor = ({
  query,
  setQuery,
  runQuery,
  loading,
  results,
}: QueryEditorProps) => {
  const [nextQuery, setNextQuery] = useState<string>("Editeur 2");
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  useEffect(() => {
    console.log("verification de la mise à jours",results?.metadata?.next);
    if (results?.metadata?.next) {
      setNextQuery(results.metadata.next);
      setQueryHistory((prevHistory)=>[...prevHistory, results.metadata?.next ?? ""]);
    }
  }, [results?.metadata?.next]);

  const handleRunClik= ()=>{
    setQueryHistory((prevHistory)=>[...prevHistory, query]);
    runQuery();
  }

  return (
    <div className="d-flex gap-3 mt-2">
      {/**code Editor 1 */}
      <div className="flex-grow-1">
        <CodeMirror
          value={query}
          height="300px"
          width="500px"
          theme={"dark"}
          extensions={[[sparql()]]}
          basicSetup={{
            lineNumbers: true,
          }}
          onChange={(value: string) => setQuery(value)}
        />
        {/** principal button run */}
        <button
          type="button"
          className="btn btn-primary mt-2"
          onClick={handleRunClik}
          disabled={loading}
        >
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      {/**code Editor 2 */}
      <div className="flex-grow-1">
        <CodeMirror
          value={nextQuery}
          height="300px"
          width="500px"
          theme={"dark"}
          extensions={[[sparql()]]}
          basicSetup={{
            lineNumbers: true,
          }}
          onChange={(value: string) => setNextQuery(value)}
        />
        {/** next query button */}
        <RunNextQueryButton
          nextQuery={nextQuery}
          setQuery={setQuery}
          runQuery={handleRunClik}
        />
      </div>
      <div>
        <h4>Historique des requêtes</h4>
        <ul className="list-group">
          {queryHistory.map((q, index) => (
            <li key={index} className="list-group-item">
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QueryEditor;
