import React, { useEffect, useState } from "react";
import "./RangeSlider.css";

interface RangeSliderProps {
  queries: string[];
  onSelectedQueries: (query1: string, query2: string) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  queries,
  onSelectedQueries,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedQuery1 , setSelectedQuery1] =useState("");
  const [selectedQuery2 , setSelectedQuery2] =useState("");


  useEffect(()=>{
    const query1 = queries[selectedIndex] || "";
    const query2 = queries[selectedIndex + 1] || "";

    setSelectedQuery1(query1);
    setSelectedQuery2(query2);

  },[selectedIndex,queries]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setSelectedIndex(Number(event.target.value));
    const index = Number(event.target.value);
    setSelectedIndex(index)
    // const query1 = queries[index] || "";
    // const query2 = queries[index + 1] || "";

    onSelectedQueries(queries[index] || "", queries[index + 1] || "");
  };
  return (
    <div>
      {/* <p>Affichage des Requête ici</p> */}
      <div className="slideContainer">
        <input
          type="range"
          min={0}
          className="slider"
          max={queries.length - 1}
          value={selectedIndex}
          onChange={handleChange}
        />
      </div>
      {/* <div className="d-flex justify-content-between mt-10 pt-2">
        <div className="w-25 border border-primary pt-2">
          <p><strong>Requête {selectedIndex + 1} :</strong></p>
          <pre>{selectedQuery1 || "Aucune requête disponible"}</pre>
        </div>

        <div className="w-25 border border-primary pt-3">
          <p><strong>Requête {selectedIndex + 2} :</strong></p>
          <pre>{selectedQuery2 || "Aucune requête disponible"}</pre>
        </div>
      </div> */}
    </div>
  );
};

export default RangeSlider;
