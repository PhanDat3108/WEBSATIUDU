import React from "react"; 
import "./App.css";
 import AppRouter from "./routers/AppRouter";
 import Footer from "./components/Footer";
  
 function App() { 
    return ( 
    <div> 
      <AppRouter /> 
       <Footer />
      </div> 
      );

   }
    export default App;