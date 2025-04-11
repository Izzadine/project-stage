interface RunNextQueryButtonProps {
    nextQuery?: string;
    setQuery: (query: string) => void;
    runQuery: () => void;
   
    
  }
  
  const RunNextQueryButton = ({ nextQuery, setQuery, runQuery }: RunNextQueryButtonProps) => {
    
    const handleClick = () => {
      if (nextQuery) {
        setQuery(nextQuery);
        runQuery();
      }
    };
  
    return (
      <button className="btn btn-primary mt-2" onClick={handleClick} disabled={!nextQuery}>
        Next Query
      </button>
    );
  };
  
  export default RunNextQueryButton;
  