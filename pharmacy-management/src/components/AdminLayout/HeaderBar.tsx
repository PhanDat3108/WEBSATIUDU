import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/AdminLayout.module.css";

const HeaderBar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.TenNhanVien || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.headerBar}>
      <div className={styles.headerLeft}>
        <h2 className={styles.headerTitle}>Hệ thống Pharmacy</h2>
      </div>

      <div className={styles.headerRight} ref={dropdownRef}>
        <div className={styles.userInfo} onClick={() => setOpenMenu((prev) => !prev)}>
          <img src="https://i.pravatar.cc/40" alt="avatar" className={styles.avatar} />
          <span className={styles.userName}>{userName}</span>
        </div>

        {openMenu && (
          <div className={styles.userDropdown}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderBar;
