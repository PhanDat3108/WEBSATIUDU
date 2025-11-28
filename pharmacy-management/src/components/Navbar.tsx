import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/home/Navbar.css";
import logo from "../styles/img/logo.png";
import { useTuiHang } from "../contexts/TuiHangContext";
import iconGioHang from "../styles/img/online-shopping.png";

const Navbar: React.FC = () => {
  const { layTongSoLuong, setMoRong } = useTuiHang();
  const total = layTongSoLuong();
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("Đang tải...");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); 
        
        if (!token) {
            return;
        }

        // Gọi API
        // Lưu ý: Tôi dùng đường dẫn /api/v1/auth/me như bạn cung cấp
        const response = await axios.get<any>("http://localhost:8080/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

       
        if (response.data && response.data.user) {
            const nameFromServer = response.data.user.TenNhanVien;
            setUserName(nameFromServer || "Người dùng");
        } else {
            // Trường hợp backend trả về khác cấu trúc dự kiến
            console.log("Cấu trúc data không khớp:", response.data);
        }

      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); 
    window.location.reload(); 
  };

  return (
    <header className="navbar">
      <div className="navbarlogin" style={{ fontSize: "15px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="notice-navbar">Thông báo sẽ hiện đây</div>

        <div className="dropdown" style={{ marginRight: '20px' }}>
            <span style={{ cursor: 'pointer', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'5px' }}>
                Hello, {userName} ▼
            </span>
            
            <div className="dropdown-content" style={{ minWidth: '150px', left: 'auto', right: 0 }}>
                <Link to="/profile" style={{ color: '#333', display: 'block', padding: '10px' }}> Hồ sơ cá nhân</Link>
                <hr style={{margin: '0', border: '0', borderTop: '1px solid #eee'}}/>
                <a href="#" onClick={handleLogout} style={{ color: '#d9534f', display: 'block', padding: '10px' }}>
                    Đăng xuất
                </a>
            </div>
        </div>
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
          <span title="Thông báo"></span>
          <button className="cart-btn" onClick={() => setMoRong(true)} title="Đơn thuốc">
    <img 
      src={iconGioHang} 
      alt="Giỏ hàng" 
      style={{ width: '24px', height: '24px', marginRight: '8px' }} 
    />
    
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