import { useEffect, useRef, useState } from "react";
import Yasqe from "@triply/yasqe";
import "@triply/yasqe/build/yasqe.min.css";
import Yasr from "@triply/yasr";
import "@triply/yasr/build/yasr.min.css";
import type { RequestConfig } from "@triply/yasqe";
// import QueryHistorySlider from "./QueryHistorySlider";
import RangeSlider from "./RangeSlider";
import QueryNavigator from "./QueryNavigator";
// import Examples from "./Examples";

const YasguiEditor = () => {
  const editor1Ref = useRef<HTMLDivElement | null>(null);
  const editor2Ref = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const yasqe1 = useRef<Yasqe | null>(null);
  const yasqe2 = useRef<Yasqe | null>(null);
  const yasr = useRef<Yasr | null>(null);

  const [activeEditor, setActiveEditor] = useState<"editor1" | "editor2">("editor1");
  const [nextQuery, setNextQuery] = useState<string | null>(null);
  const [queries, setQueries] = useState<string[]>([]);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [queryIndex, setQueryIndex] = useState(1);
  const [isLooping, setIsLooping] = useState(false); // 🔄 Ajout d'un état pour la boucle
  //const [stopLoop, setStopLoop] =useState(false);

  const stopLoopRef =useRef(false);
  const[currentSlide, setCurrentSlide] =useState(0);
  const [selectedQueries, setSelectedQueries] =useState(["", ""]);
  // const [endpoint, setEndpoint] = useState("http://localhost:3330/watdiv10m.jnl/passage");


  // hook use State print the result for the current query executed
  // const [queryResults, setQueryResults] = useState<any | null>(null);
  const [queryResults, setQueryResults] = useState<{[index:number]:any}>({});
  const [currentQueryIndex, setCurrentQueryIndex]= useState(0);


  useEffect(() => {
    const defaultQuery = "";
    if (editor1Ref.current && !yasqe1.current) {
      yasqe1.current = new Yasqe(editor1Ref.current);
      yasqe1.current?.focus();
      yasqe1.current.setValue(defaultQuery);
      yasqe1.current.refresh();
    }

    if (editor2Ref.current && !yasqe2.current) {
      yasqe2.current = new Yasqe(editor2Ref.current);
      yasqe2.current.setValue("");
      yasqe2.current.refresh();

    }

    if (resultsRef.current && !yasr.current) {
      resultsRef.current.innerHTML = "";
      yasr.current = new Yasr(resultsRef.current);
    }

    return () => {
      if (resultsRef.current) {
        resultsRef.current.innerHTML = "";
      }
    };
  }, []);

  

  useEffect(() => {
    if (yasqe2.current && nextQuery) {
      yasqe2.current.setValue(nextQuery);
      yasqe2.current.refresh();
    }
  }, [nextQuery]);

  useEffect (()=>{
    if(queryHistory.length>0){
      const query1 = queryHistory[currentSlide] || "";
      const query2 = queryHistory[currentSlide +1] || "";

      yasqe1.current?.setValue(query1);
      yasqe1.current?.refresh();

      yasqe2.current?.setValue(query2);
      yasqe2.current?.refresh();
    }
  },[currentSlide, queryHistory]);

  useEffect(()=>{
    if(yasr.current && queryResults[currentQueryIndex]){
      yasr.current.setResponse(queryResults[currentQueryIndex]);
    }
  },[currentQueryIndex, queryResults]);

  const executeQuery = async (queryText: string, index:number) => {
    if (!queryText.trim()) {
      console.warn("⚠️ Impossible d'exécuter une requête vide !");
      return null;
    }

    setQueryHistory(prev => [...new Set([...prev, queryText])]);

    const args: { name: string; value: string }[] = [{ name: "query", value: queryText }];

    const requestConfig: RequestConfig<Yasqe> = {
      endpoint: "https://10-54-2-226.gcp.glicid.fr/wikidata/passage",
      method: "POST",
      args: args,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/sparql-results+json",
      },
      queryArgument: undefined,
      acceptHeaderGraph: "",
      acceptHeaderSelect: "",
      acceptHeaderUpdate: "",
      namedGraphs: [],
      defaultGraphs: [],
      withCredentials: false,
      adjustQueryBeforeRequest: false,
    };

    try {
      const response = await yasqe1.current?.query(() => requestConfig);
      if(response){
        setQueryResults(prevResults =>({
          ...prevResults,
          [index]: response,
        }));
      }
      // yasr.current?.setResponse(response);

      // setQueryResults(response);
      return response;
    } catch (error) {
      console.error("❌ Erreur lors de l'exécution :", error);
      return null;
    }
  };

  // const handleRunQuery = async (editor: "editor1" | "editor2") => {
  //   const yasqeInstance = editor === "editor1" ? yasqe1.current : yasqe2.current;
  //   if (yasqeInstance && yasr.current) {
  //     setActiveEditor(editor);

  //     const queryText = yasqeInstance.getValue();
  //     const response = await executeQuery(queryText,queryIndex);

  //     if (response?.metadata?.next) {
  //       setNextQuery(response.metadata.next);
  //       if (editor === "editor2") {
  //         yasqe1.current?.setValue(queryText);
  //         yasqe1.current?.refresh();
  //       }
  //       setQueryIndex(prevIndex => prevIndex + 1);
  //       setQueries(prevQueries => [...new Set([...prevQueries, response.metadata.next])]);
  //     }
  //   }
  // };

  const handleRunQuery = async (editor: "editor1" | "editor2") => {
    const yasqeInstance = editor === "editor1" ? yasqe1.current : yasqe2.current;
    if (yasqeInstance && yasr.current) {
      setActiveEditor(editor);
  
      const queryText = yasqeInstance.getValue();
      const index = queryIndex;
  
      const response = await executeQuery(queryText, index);
  
      if (response) {
        yasr.current.setResponse(response);
        setCurrentQueryIndex(index); 
      }
  
      if (response?.metadata?.next) {
        setNextQuery(response.metadata.next);
  
        if (editor === "editor2") {
          yasqe1.current?.setValue(queryText);
          yasqe1.current?.refresh();
        }
  
        setQueryIndex(prevIndex => prevIndex + 1);
        setQueries(prevQueries => [...new Set([...prevQueries, response.metadata.next])]);
      }
    }
  };
  

  const handleRunLoop = async () => {
    setIsLooping(true);
    // setStopLoop(false);
    stopLoopRef.current=false;

    let currentQuery = yasqe1.current?.getValue();
    let currentIndex=queryIndex; // utilisation d'une variable local  pour bien ciblé le index de requête
    while (currentQuery && !stopLoopRef.current) {
      const response = await executeQuery(currentQuery,currentIndex); // ajout de la varibale queryIndex

      if (response?.metadata?.next) {
        yasqe1.current?.setValue(currentQuery);
        yasqe1.current?.refresh();

        setNextQuery(response.metadata.next);

        currentIndex++; //Incrémentation locale
        
        // setQueryIndex(prevIndex => prevIndex + 1);
        setQueryIndex(currentIndex);

        {/**to  */}
        setQueries(prevQueries => [...new Set([
          ...prevQueries, response.metadata.next
        ])]);
        currentQuery = response.metadata.next;
      } else {
        break;
      }
    }
    setIsLooping(false);
  };

  const handleStopLoop = ()=>{
    // setStopLoop(true);
    stopLoopRef.current=true;
    setIsLooping(false);
  };

  // const handleSelectQuery = (query: string) => {
  //   yasqe1.current?.setValue(query);
  // };

  const handleSelectQueries =(quer1:string,query2:string) =>{
    if(yasqe1.current){
      yasqe1.current.setValue(quer1);
      yasqe1.current.refresh();
    }
    if(yasqe2.current){
      yasqe2.current.setValue(query2);
      yasqe2.current.refresh();
    }
  };

  const handleQuerySelection = (query1Index:number, query2Index:number) =>{
    setSelectedQueries([
      queries[query1Index] || "",
      queries[query2Index] || ""
    ]);
    setCurrentQueryIndex(query1Index);
  };

  return (
    <div className="container pt-5">
      {/* Deux éditeurs côte à côte */}
      <div  className="row g-4">
        <div className="col-md-6 pt-4">
          <div className="card shadow" style={{backgroundColor:"#343a40"}}>
          <div className="card-header bg-dark text-white d-flex justify-content-between align-item-center">
            <span style={{background:"none"}}>Continuation Query {queryIndex}</span>
            {/* <div className="input-group input-group-sm  bg-transparent" style={{width:"50%"}}>
              <span style={{background:"none"}}>Endpoint</span>
              <input type="text" 
              className="form-control bg-white"
              value={endpoint}
              onChange={(e)=>setEndpoint(e.target.value)}
              />
            </div> */}

          </div>
          <div className="card-body bg-light" ref={editor1Ref} style={{height: "300px", width:"100%", border: "1px solid", overflow:"hidden"}} />
           <div className="card-footer d-flex justify-content-between">
           <button className="btn  btn-success" style={{borderRadius:"15px"}} onClick={() => handleRunQuery("editor1")}>
            <i className="fa fa-play" style={{color:"white", background:"none", }}></i> Run once
            
          </button>
          <button
            className="btn btn-success"
            style={{borderRadius:"15px"}}
            onClick={handleRunLoop}
            disabled={isLooping}
          >
            <i className="fa fa-play" style={{color:"white", background:"none"}}></i> {isLooping ? "Execution looping..." : "Loop Execution"}
          </button>
          <button
          className="btn btn-danger"
          style={{borderRadius:"15px"}}
          onClick={handleStopLoop}
          >
            <i className="fa fa-stop" style={{color:"white", background:"none"}}></i> Stop Execution
          </button>
           </div>

        </div>
        </div>

        <div className="col-md-6 pt-4">
          <div className="card shadow " style={{backgroundColor:"#343a40"}}>
            <div className="card-header bg-dark text-white">Continuation Query {queryIndex + 1}</div>
            <div className="editor2 card-body bg-light" ref={editor2Ref} style={{ height: "300px",width:"100%", border: "1px solid", overflow:"hidden", display:"flex", flexDirection:"column", backgroundColor:"#1e1e1e" }} />
            <div className="card-footer">
               <button 
               className="btn btn-success"
              style={{borderRadius:"15px"}}
               
               onClick={() => handleRunQuery("editor2")}>
                 <i className="fa fa-play" style={{color:"white", background:"none"}}></i> Next Query
               </button>
           </div>
          </div>
          </div>
      </div>

      <div className="mt-4">
        <RangeSlider queries={queryHistory} onSelectedQueries={handleSelectQueries}/>
      </div>

      <div className="mt-4">
        <QueryNavigator totalQueries={queries.length} onSelectQueries={handleQuerySelection} onChange={(newIndex)=>setQueryIndex(newIndex)}/>
      </div>

     
      {/* Tableau de résultats unique */}
      <div className="mt-4">
        <div className=" card-header bg-dark text-white">
          Resutlts of query {queryIndex}
           {/* Résults (Source: {activeEditor}) */}
          </div>

        <div className="card-body" ref={resultsRef} style={{height: "300px", border: "5px solid #1e1e1e", backgroundColor:"#ffffff" }}/>
        {/* </div> */}
      </div>

      {/* <Examples/> */}

      
      
     {/* slider des historique de requêtes */}
      {/* <div >
        <QueryHistorySlider history={queryHistory} onSelectQuery={handleSelectQuery} setCurrentSlide={setCurrentSlide} />
      </div> */}

    </div>
  );
};

export default YasguiEditor;
