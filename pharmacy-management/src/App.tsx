import React from "react";
import "./App.css";
import AppRouter from "./routers/AppRouter";
import { NhaPungCungCapTuiHang } from "./contexts/TuiHangContext";
import TuiHangSidebar from "./components/TuiHangSidebar";

function App() {
   return (
      <NhaPungCungCapTuiHang>
         <div>
            <AppRouter />
            <TuiHangSidebar />
         </div>
      </NhaPungCungCapTuiHang>
   );
}

export default App;