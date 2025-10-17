import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import HomePage from './pages/HomePage';
import { Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <div className="App">
      {/* 1. Tạo thanh điều hướng (Navigation) */}
      <nav>
        <ul>
          <li>
            <Link to="/">Trang Chủ</Link>
          </li>
          <li>
            <Link to="/register">Đăng Ký</Link>
          </li>
        </ul>
      </nav>

   
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
