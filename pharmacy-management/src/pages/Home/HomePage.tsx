// src/pages/HomePage.tsx
import React from "react";
// import { Link } from "react-router-dom"; // Không dùng, có thể xóa
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import DanhSachSanPham from "../../components/HomeFroms/DanhSachSanPham"; // <-- 1. Import component mới

const HomePage: React.FC = () => {
  return (
    <>
      <Navbar /> {/* */}
      
      <main>
        {/* 2. Chèn danh sách sản phẩm vào đây */}
        <DanhSachSanPham />
      </main>
      
      <Footer /> {/* */}
    </>
  );
};

export default HomePage;