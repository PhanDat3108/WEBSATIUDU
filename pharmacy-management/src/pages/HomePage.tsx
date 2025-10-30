// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";

function HomePage() {
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    axios.get("http://localhost:8080/")
      .then(res => setMsg(res.data))
      .catch(err => console.error("Lỗi khi gọi API", err));
  }, []);

  return (
    <div>
      <Navbar></Navbar>
      <p>{msg}</p>
    </div>
  );
}

export default HomePage;