import React from "react";

import { Link } from "react-router-dom";

import "../styles/home/Navbar.css";

import logo from "../styles/img/logo.png";

import { useTuiHang } from "../contexts/TuiHangContext";



const Navbar: React.FC = () => {

  const { layTongSoLuong, setMoRong } = useTuiHang();

  const total = layTongSoLuong();



  return (

    <header className="navbar">

      <div className="navbarlogin" style={{ fontSize: "15px" }} >

        <div className="notice-navbar">Thông báo sẽ hiện đây</div>

        <a href="#login" style={{ marginRight: '5px' }}>Đăng nhập </a>

        <i> / </i>

        <a href="#register" style={{ marginLeft: '5px' }}>Đăng kí </a>

      </div>

      <div className="navbar-top">

        <div className="navbar-logo">

          <img src={logo} alt="Logo" />

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

          <button className="cart-btn" onClick={() => setMoRong(true)} title="Đơn thuốc">

            Đơn thuốc

            <span className="cart-badge">{total}</span>

          </button>

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