// import "./src/styles.css"

import { useEffect, useState } from "react";

//import { Link } from "react-router-dom";
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect (()=>{
    const handleScroll = ()=>{
      if(window.scrollY>50){
        setScrolled(true);
      }else{
        setScrolled(false);
      }

    };
    window.addEventListener("scroll", handleScroll);
    return ()=> window.removeEventListener("scroll", handleScroll)
  }, [])
  return (
    <>
      <nav className={` navbar navbar-expand-lg fixed-top mb-5 ${scrolled ? "bg-light shadow" : "bg-transparent"}`}>
        <div className="container">
          <a className="navbar-brand " href="#">Passage</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"> <a className="nav-link active" href="#">Home</a> </li>
              <li className="nav-item"> <a className="nav-link active" href="#">Contact</a> </li>
              <li className="nav-item"> <a className="nav-link active" href="#">
                <i className="fa fa-folder-open-o mx-1"></i>Docs</a> </li>
            </ul>

          </div>
        </div>
        {/* <button type="button" className="btn btn-default ml-4" style={{border:"1px solid"}}><span className="fa fa-folder-open">Examples</span></button> */}
      </nav>
    </>
  );
     {/**
    <nav className="navbar navbar-light bg-light w-100">
      <a className="navbar-brand ms-3" href="#">
        Passage
      </a>
      <div className="">
        <li>
          <button type="button" className="btn btn-default">
            <span className="fa fa-folder-open"></span>
          </button>
        </li>

        <li className="dropdown">
          <span> dropdown</span>

        </li>
       
         * <Link className="mx-2" to="/">
          Home
        </Link>
        <Link className="mx-2" to="/about">
          About
        </Link>
        <Link className="mx-2" to="#">
          Contact
        </Link>

        </div>
    </nav>

         */}

        
      
  
}
export default Navbar;
