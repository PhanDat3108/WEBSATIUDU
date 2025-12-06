import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/home/Navbar.css";
import logo from "../styles/img/logo.png";
import iconGioHang from "../styles/img/online-shopping.png";
import { useTuiHang } from "../contexts/TuiHangContext";
import { getLoaiThuocListname } from "../api/loaiThuocApi"; // Đảm bảo đã có file api này

// 1. Định nghĩa Interface Props để HomePage có thể truyền hàm vào
interface NavbarProps {
  onSelectCategory?: (maLoai: string, tenLoai: string) => void;
  onSearchKeyword?: (keyword: string) => void;
}
const quotes = [
  "Người thầy thuốc trước hết phải có lòng nhân ái.",
  "Chữa bệnh là cứu người, không phải vì tiền bạc.",
  "Y học không có giới hạn, lòng nhân từ cũng không.",
  "Người làm thầy thuốc phải xem bệnh nhân như người thân.",
  "Trước khi là thầy thuốc giỏi, hãy là con người có tấm lòng.",
  "Bệnh nhân cần sự chăm sóc từ trái tim, không chỉ từ bàn tay.",
  "Một người thầy thuốc tốt cần hiểu rõ nỗi đau của bệnh nhân.",
  "Không có bệnh nào nhỏ, chỉ có lòng người không đủ lớn.",
  "Y đức là nền tảng của một người thầy thuốc chân chính.",
  "Không có sự chữa lành nào vĩ đại hơn tình thương.",
  "Trách nhiệm của thầy thuốc không chỉ là chữa bệnh, mà còn là an ủi tinh thần.",
  "Đạo làm thầy thuốc là cống hiến cho đời, không mưu cầu lợi ích.",
  "Người thầy thuốc giỏi là người có trái tim nhân hậu.",
];
// 2. Khai báo Component nhận Props
const Navbar: React.FC<NavbarProps> = ({ onSelectCategory, onSearchKeyword }) => {
  // --- Hooks & Context ---
  const { layTongSoLuong, setMoRong } = useTuiHang();
  const total = layTongSoLuong();
  const navigate = useNavigate();

  // --- State ---
  const [userName, setUserName] = useState<string>("Đang tải...");
  const [categories, setCategories] = useState<{ MaLoai: string; TenLoai: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSpecialFilter = (type: string, label: string) => {
    if (onSelectCategory) {
      // Gửi type làm "Mã Loại" để HomePage nhận biết
      onSelectCategory(type, label);
    }
  };

  // --- Effect: Lấy thông tin User & Danh mục ---
  useEffect(() => {
    // 1. Lấy thông tin User
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUserName("Khách");
          return;
        }
        const response = await axios.get<any>("http://localhost:8080/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.user) {
          setUserName(response.data.user.TenNhanVien || "Người dùng");
        }
      } catch (error) {
        console.error("Lỗi auth:", error);
        setUserName("Khách");
      }
    };

    // 2. Lấy danh sách Loại thuốc cho Dropdown
    const fetchCategories = async () => {
      try {
        const data = await getLoaiThuocListname();
        // Ép kiểu nếu cần thiết tùy vào dữ liệu trả về từ API
        setCategories(data as any[]);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };

    fetchUserData();
    fetchCategories();
  }, []);

  // --- Handlers ---

  // Xử lý đăng xuất
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  // Xử lý chọn danh mục
  const handleCategoryClick = (maLoai: string, tenLoai: string) => {
    if (onSelectCategory) {
      onSelectCategory(maLoai, tenLoai);
    }
    setSearchTerm(""); // Reset ô tìm kiếm khi chọn danh mục
  };

  // Xử lý tìm kiếm
  const handleSearchAction = () => {
    const term = searchTerm.trim();
    if (onSearchKeyword) {
      onSearchKeyword(term);
    }
  };

  // Tìm kiếm khi nhấn Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchAction();
    }
  };

  return (
    <header className="navbar">
      {/* --- Dòng trên cùng: Thông báo & User --- */}
      <div
        className="navbarlogin"
        style={{ fontSize: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="notice-navbar">
          {/* Class scrolling-text vẫn giữ nguyên animation CSS ở bước trước */}
          <div className="scrolling-text">
            {quotes.map((quote, index) => (
              <span key={index} style={{ marginRight: "100px", display: "inline-block" }}>
                ★ {quote} {/* Thêm dấu sao hoặc icon cho đẹp nếu thích */}
              </span>
            ))}
          </div>
        </div>
        {/* ------------------- */}

        <div className="dropdown" style={{ marginRight: "20px" }}>
          <span style={{ cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
            Hello, {userName} ▼
          </span>
          <div className="dropdown-content" style={{ minWidth: "150px", left: "auto", right: 0 }}>
            {userName !== "Khách" ? (
              <>
                <Link to="/profile" style={{ color: "#333", display: "block", padding: "10px" }}>
                  Hồ sơ cá nhân
                </Link>
                <hr style={{ margin: "0", border: "0", borderTop: "1px solid #eee" }} />
                <a href="#" onClick={handleLogout} style={{ color: "#d9534f", display: "block", padding: "10px" }}>
                  Đăng xuất
                </a>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: "#333", display: "block", padding: "10px" }}>
                  Đăng nhập
                </Link>
                <Link to="/register" style={{ color: "#333", display: "block", padding: "10px" }}>
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- Dòng chính: Logo, Danh mục, Search, Cart --- */}
      <div className="navbar-top">
        <div className="navbar-logo">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleCategoryClick("", "");
            }}
            style={{ fontWeight: "bold", color: "#ffffffff" }}
          >
            <img src={logo} alt="Logo" />
          </a>
        </div>

        {/* Nút Danh mục Dropdown */}
        <div className="dropdown" style={{ display: "inline-block" }}>
          <button className="navbar-category">☰ Danh mục</button>
          <div className="dropdown-content" style={{ minWidth: "200px", maxHeight: "300px", overflowY: "auto" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCategoryClick("", "");
              }}
              style={{ fontWeight: "bold", color: "#007bff" }}
            >
              Xem tất cả
            </a>
            <hr style={{ margin: "5px 0", borderTop: "1px solid #eee" }} />
            {categories.map((loai) => (
              <a
                key={loai.MaLoai}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(loai.MaLoai, loai.TenLoai);
                }}
              >
                {loai.TenLoai}
              </a>
            ))}
          </div>
        </div>

        {/* Ô tìm kiếm */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Tìm kiếm thuốc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="search-btn" onClick={handleSearchAction}>
            🔍
          </button>
        </div>

        {/* Icons & Giỏ hàng */}
        <div className="navbar-icons">
          <span title="Thông báo"></span>
          <button className="cart-btn" onClick={() => setMoRong(true)} title="Đơn thuốc">
            <img src={iconGioHang} alt="Giỏ hàng" style={{ width: "24px", height: "24px", marginRight: "8px" }} />
            Đơn thuốc
            <span className="cart-badge">{total}</span>
          </button>
        </div>
      </div>

      {/* --- Menu điều hướng --- */}
      <nav className="navbar-menu">
        {/* 1. Trang chủ: Load lại toàn bộ */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleCategoryClick("", "");
          }}
          style={{ fontWeight: "bold", color: "#ffffffff" }}
        >
          Trang chủ
        </a>

        {/* 2. Sản phẩm HOT */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleSpecialFilter("HOT", "🔥 Sản phẩm Bán Chạy");
          }}
          style={{ fontWeight: "bold" }}
        >
          Sản phẩm HOT
        </a>

        {/* 3. Sản phẩm Mới */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleSpecialFilter("NEW", "✨ Sản phẩm Mới");
          }}
          style={{ fontWeight: "bold" }}
        >
          Hàng Mới Về
        </a>

        {/* 4. Tặng kèm */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleSpecialFilter("FREE", "🎁 Quà tặng 0đ");
          }}
          style={{ fontWeight: "bold" }}
        >
          Tặng Kèm
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
