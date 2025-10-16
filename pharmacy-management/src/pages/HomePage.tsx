// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    axios.get("http://localhost:8080/")
      .then(res => setMsg(res.data))
      .catch(err => console.error("Lỗi khi gọi API", err));
  }, []);

  return (
    <div>
      <h1>Kết nối React - Node - MySQL</h1>
      <p>{msg}</p>
    </div>
  );
}

export default HomePage;