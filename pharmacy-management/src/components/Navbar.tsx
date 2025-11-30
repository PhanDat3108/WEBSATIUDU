import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/home/Navbar.css";
import logo from "../styles/img/logo.png";
import { useTuiHang } from "../contexts/TuiHangContext";
import { getLoaiThuocListname } from "../api/loaiThuocApi";

interface NavbarProps {
  // Hàm chọn danh mục (giữ nguyên)
  onSelectCategory?: (maLoai: string, tenLoai: string) => void;
  // [MỚI] Hàm tìm kiếm theo từ khóa
  onSearchKeyword?: (keyword: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSelectCategory, onSearchKeyword }) => {
  const { layTongSoLuong, setMoRong } = useTuiHang();
  const total = layTongSoLuong();
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("Đang tải...");
  const [categories, setCategories] = useState<{ MaLoai: string; TenLoai: string }[]>([]);
  
  // [MỚI] State lưu từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUserData = async () => { /* ...code cũ giữ nguyên... */ 
      try {
        const token = localStorage.getItem("token"); 
        if (!token) return;
        const response = await axios.get<any>("http://localhost:8080/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.user) {
            setUserName(response.data.user.TenNhanVien || "Người dùng");
        }
      } catch (error) { console.error(error); }
    };
    fetchUserData();

    const fetchCategories = async () => {
      try {
        const data = await getLoaiThuocListname();
        setCategories(data as any[]); 
      } catch (error) { console.error("Lỗi danh mục:", error); }
    };
    fetchCategories();
  }, [navigate]);

  // Logic Click Danh mục (Giữ nguyên)
  const handleCategoryClick = (maLoai: string, tenLoai: string) => {
    if (onSelectCategory) onSelectCategory(maLoai, tenLoai);
    setSearchTerm(""); // Xóa ô tìm kiếm khi chọn danh mục
  };

  // [MỚI] Logic Xử lý tìm kiếm
  const handleSearchAction = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return; // Nếu rỗng thì thôi

    // 1. Trường hợp 1: Kiểm tra xem user có gõ đúng tên Loại thuốc không?
    const foundCategory = categories.find(c => c.TenLoai.toLowerCase() === term);

    if (foundCategory) {
      // Nếu trùng tên loại -> Coi như đang chọn danh mục đó
      if (onSelectCategory) {
        onSelectCategory(foundCategory.MaLoai, foundCategory.TenLoai);
      }
    } else {
      // 2. Trường hợp 2: Tìm theo tên thuốc
      if (onSearchKeyword) {
        onSearchKeyword(searchTerm);
      }
    }
  };

  // Xử lý khi nhấn Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchAction();
    }
  };

  const handleLogout = (e: React.MouseEvent) => { /* ...giữ nguyên... */ 
    e.preventDefault(); localStorage.removeItem("token"); localStorage.removeItem("user");
    navigate("/login"); window.location.reload(); 
  };

  return (
    <header className="navbar">
      {/* ... Phần Login giữ nguyên ... */}
      <div className="navbarlogin" style={{ fontSize: "15px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="notice-navbar">Thông báo sẽ hiện đây</div>
        <div className="dropdown" style={{ marginRight: '20px' }}>
            <span style={{ cursor: 'pointer', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'5px' }}>Hello, {userName} ▼</span>
            <div className="dropdown-content" style={{ minWidth: '150px', left: 'auto', right: 0 }}>
                <Link to="/profile" style={{ color: '#333', display: 'block', padding: '10px' }}> Hồ sơ cá nhân</Link>
                <hr style={{margin: '0', border: '0', borderTop: '1px solid #eee'}}/>
                <a href="#" onClick={handleLogout} style={{ color: '#d9534f', display: 'block', padding: '10px' }}>Đăng xuất</a>
            </div>
        </div>
      </div>

      <div className="navbar-top">
        <div className="navbar-logo"><img src={logo} alt="Logo" /></div>

        <div className="dropdown" style={{ display: 'inline-block' }}>
          <button className="navbar-category">☰ Danh mục ▼</button>
          <div className="dropdown-content" style={{ minWidth: '200px', maxHeight: '400px', overflowY: 'auto' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick("", ""); }} style={{ fontWeight: 'bold', color: '#007bff' }}>Xem tất cả thuốc</a>
            <hr style={{ margin: '5px 0', borderTop: '1px solid #eee' }} />
            {categories.map((loai) => (
              <a key={loai.MaLoai} href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick(loai.MaLoai, loai.TenLoai); }}>{loai.TenLoai}</a>
            ))}
          </div>
        </div>

        {/* [ĐÃ SỬA] Phần Tìm kiếm */}
        <div className="navbar-search">
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="search-btn" onClick={handleSearchAction}>🔍</button>
        </div>

        <div className="navbar-icons">
          <span title="Thông báo"></span>
          <button className="cart-btn" onClick={() => setMoRong(true)} title="Đơn thuốc" style={{display: 'flex', alignItems: 'center'}}>
            Đơn thuốc <span className="cart-badge" style={{marginLeft: '5px'}}>{total}</span>
          </button>
        </div>
      </div>

     {/* Menu điều hướng giữ nguyên */}
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