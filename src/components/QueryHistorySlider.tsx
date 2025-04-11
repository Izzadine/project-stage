import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrevArrow, NextArrow } from "./PrevAndNextArrow";


type QueryHistorySliderProps = {
  history: string[];
  onSelectQuery: (query: string) => void;
  setCurrentSlide: (index:number) => void;
};

const QueryHistorySlider: React.FC<QueryHistorySliderProps> = ({ history, onSelectQuery, setCurrentSlide }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2, // Nombre de requêtes visibles en même temps
    slidesToScroll: 1,
    arrows: true,
    prevArrow:<PrevArrow/>,
    nextArrow:<NextArrow/>,
    beforeChange:(oldIndex:number, newIndex:number) =>{
      setCurrentSlide(newIndex);
    },

  };
  //console.log("prevArrow utilise dans le slider:", PrevArrow);

  return (
    <div className="me-1.25 ms-1.25">
      <h4  className="text-md-center fw-bold text-primary mb-5">Historique des requêtes</h4>
      <Slider {...settings}>
        {history.map((query, index) => (
        <div key={index} className="query-slider" onClick={()=> onSelectQuery(query)}>
            {index + 1 }:{query}
        </div>
        ))}
      </Slider>
    </div>
  );
};

export default QueryHistorySlider;
