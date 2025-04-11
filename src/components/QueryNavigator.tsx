import React, { useState } from "react";

interface QueryNavigatorProps{
    totalQueries:number;
    onSelectQueries:(query1Index:number, query2Index:number)=>void;
    onChange?: (newIndex:number) =>void;
}

const QueryNavigator: React.FC<QueryNavigatorProps> =({totalQueries, onSelectQueries, onChange}) =>{
    const[currentIndex, setCurrentIndex]=useState(0);

    const handlePrevious =() =>{
        if(currentIndex >0 ){
            const newIndex = currentIndex-1;
            // setCurrentIndex(currentIndex -1);
            setCurrentIndex(newIndex);
            // onSelectQueries(currentIndex-1, currentIndex);
            onSelectQueries(newIndex,newIndex+1);
            if(onChange)  onChange(newIndex);
        }
    };

    const handleNext =()=>{
        if(currentIndex< totalQueries){
            const newIndex = currentIndex +1;

            // setCurrentIndex(currentIndex+1);
            setCurrentIndex(newIndex);
            onSelectQueries(newIndex,newIndex+1);
            // onSelectQueries(currentIndex+1, currentIndex+2);
            if(onChange)  onChange(newIndex);

        }
    };

    return(
        <div className="query-navigator" 
        // style={{display:"flex", alignItems:"center", gap:"10px", fontSize:"20px"}}
        >
            <span>0</span>
            <button className="" style={{cursor:"pointer"}} onClick={handlePrevious} disabled={currentIndex===0}>{"<"}</button>

            {/**Affichage de l'index courant */}
            { totalQueries >0 ? (
                <div className="cirle"
                // style={{width:"100px", 
                //     height:"40px", 
                //     borderRadius:"50%", 
                //     border:"2px solid black", 
                //     display:"flex",
                //     alignContent:"center",
                //     justifyContent:"center",
                //     fontWeight:"bold"
                // }}
                >
                {/* - {Math.min(currentIndex+2, totalQueries) */}
                {currentIndex} 
            </div>    
            ):(
                <div style={{width:"50px", height:"50px"}}></div>
            )}    
            
            {/* button droit */}
            <button className="btn btn-secondary  btn-navigator"  onClick={handleNext} disabled={currentIndex >=totalQueries }>{">"}</button>

            {/* Max */}
            <span>{totalQueries}</span>
        </div>
    );
};

export default QueryNavigator;