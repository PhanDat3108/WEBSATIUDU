import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h1 style={{ color: "#333" }}>Chào mừng đến với Hệ thống Quản lý Tủ thuốc</h1>
      <p style={{ color: "#555", fontSize: "1.1em" }}>Vui lòng đăng nhập để tiếp tục...</p>

      {/* Liên kết đến trang Login thật */}
      <Link
        to="/login"
        style={{
          fontSize: "1.2rem",
          margin: "10px",
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "5px",
          textDecoration: "none",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        Đăng nhập
      </Link>

      {/* =================================================== */}
      {/* 💥 LINK PHÁT TRIỂN FE ADMIN ("Cửa sau") 💥 */}
      <div style={{ marginTop: "50px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
        <p style={{ color: "#dc3545", fontWeight: "bold" }}>
          Chế độ Phát triển FE Admin (Xóa sau khi hoàn thành Login):
        </p>
        <Link
          to="/admin/dashboard"
          style={{ color: "#007bff", textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}
        >
          [Truy cập Admin Dashboard (MOCK AUTH)]
        </Link>
      </div>
      {/* =================================================== */}
    </div>
  );
};

export default HomePage;
