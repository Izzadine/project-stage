import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Flèche précédente
const PrevArrow: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  currentSlide?:number;
}> = (props) => {
    // console.log("props reçu par PrevArrow :", props);

    const isDisabled = props.className?.includes("slick-disabled") ;
    // console.log("isDisabled", isDisabled, "classname", props.className);
   
  return (
    <FaChevronLeft
      className={props.className}
      style={{
        ...props.style,
        display: "block",
        color: "blue",
        fontSize: "24px",
        cursor: "pointer",
        left: "20px",
        position: "absolute",
        zIndex: 10,
        
        // border: isDisabled ? "5px solid gray" : "5px solid red",
        pointerEvents: isDisabled ? "none" : "auto", // 🔥 Empêche le clic si désactivé
      }}
      onClick={props.onClick}
    />
  );
};

// Flèche suivante
const NextArrow: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ className, style, onClick }) => {
  return (
    <FaChevronRight
      className={className}
      style={{
        ...style,
        display: "block",
        color: "blue",
        fontSize: "24px",
        cursor: "pointer",
        right: "20px",
        position: "absolute",
        zIndex: 1000,
        width:"40px",
        height:"40px"
        
      }}
      onClick={onClick}
    />
  );
};

export { PrevArrow, NextArrow };
