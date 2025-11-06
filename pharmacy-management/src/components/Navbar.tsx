import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../styles/img/logo.png";

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="navbarlogin" style={{ fontSize: "15px" }} >
        <div className="notice-navbar">Thông báo sẽ hiện đây</div>
        <a href="" style={{ marginRight: '5px' }}>Đăng nhập </a>
        <i> / </i>
        <a href="" style={{ marginLeft: '5px' }}>Đăng kí </a>
      </div>
      <div className="navbar-top">
        <div className="navbar-logo">
<<<<<<< HEAD
          <img src="/logo.png" alt="Logo" />
          <h2>SATIUDU</h2>
=======
          <img src={logo} alt="Logo" />
>>>>>>> 05c036b5444e70aa1e7597c8445824ace1adcdd2
        </div>

        <button className="navbar-category">
          ☰ Danh mục
        </button>

        <div className="navbar-search">
          <input type="text" placeholder="Thực phẩm chức năng..." />
          <button className="search-btn">🔍</button>
        </div>

        <div className="navbar-icons">
          <span title="Thông báo">🔔</span>
          <Link to="/cart" className="cart-btn">Đơn thuốc</Link>
        </div>
      </div>

      <nav className="navbar-menu">
        <Link to="/" >Trang chủ</Link>
        <Link to="/gioi-thieu">Giới thiệu</Link>
        <div className="dropdown">
          <Link to="/san-pham">Sản phẩm ▼</Link>
          <div className="dropdown-content">
            <Link to="/san-pham/chuc-nang">Thực phẩm chức năng</Link>
            <Link to="/san-pham/y-duoc">Dược phẩm</Link>
          </div>
        </div>
        <Link to="/khuyen-mai">Sản phẩm khuyến mãi</Link>
        <div className="dropdown">
          <Link to="/tin-tuc">Tin tức ▼</Link>
          <div className="dropdown-content">
            <Link to="/tin-tuc/suc-khoe">Sức khỏe</Link>
            <Link to="/tin-tuc/meo-hay">Mẹo hay</Link>
          </div>
        </div>
        <Link to="/faq">Câu hỏi thường gặp</Link>
        <Link to="/lien-he">Liên hệ</Link>
      </nav>
    </header>
  );
};

export default Navbar;
