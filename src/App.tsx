//import QuerySearch from "./components/QuerySearch/QuerySearch";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "yasgui/dist/yasgui.min.css";
import "@triply/yasgui/build/yasgui.min.css"

import "./styles.css";
import "./App.css";


import YasguiEditor from "./components/YasguiEditor";
//import { Container } from "react-bootstrap";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  

  return (
    <div>
      <Navbar/>
      <YasguiEditor/>
      <div>
      <Footer/>
      </div>
      

    </div>
    
  );
   
    

      
   
  
}

export default App;
