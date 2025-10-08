import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/") // Gọi API từ backend
      .then((res) => setMsg(res.data))
      .catch((err) => console.error("Lỗi kết nối API:", err));
  }, []);

  return (
    <div className="App">
      <h1>Kết nối React - Node - MySQL</h1>
      <p>{msg}</p>
    </div>
  );
}

export default App;
