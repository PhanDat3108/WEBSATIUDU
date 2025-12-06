// src/components/AdminLayout/Sidebar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../styles/AdminLayout.module.css";
import LogoSideBar from "../../assets/Logo.png";
import {
  AppstoreOutlined,
  BarChartOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  // [MỚI] State để quản lý mục menu nào đang mở
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  // [MỚI] Cấu trúc menu mới với menu con
  const menuItems = [
    { key: "/admin/revenue", icon: <HomeOutlined />, label: "Trang chủ" },
    {
      key: "ql-thuoc", // Key cha
      icon: <MedicineBoxOutlined />,
      label: "Quản lý thuốc",
      children: [
        { key: "/admin/medicines", label: "Quản lý số lượng" }, // (nguồn 214)
        { key: "/admin/suppliers", label: "Quản lý nhà cung cấp" }, // [MỚI]
        { key: "/admin/categories", label: "Quản lý loại thuốc" }, // [MỚI]
      ],
    },
    // [MỚI]
    { key: "/admin/patients", icon: <UserOutlined />, label: "Quản lý bệnh nhân" },
    { key: "/admin/employees", icon: <TeamOutlined />, label: "Quản lý nhân viên" },
    { key: "/admin/reports", icon: <BarChartOutlined />, label: "Thống kê" },
    {
      key: "kho-giao-dich", // [MỤC CHA MỚI] Kho & Giao Dịch
      icon: <AppstoreOutlined />,
      label: "Kho & Giao Dịch",
      children: [
        // Thằng quản lý phiếu nhập (Nhập Kho)
        { key: "/admin/import", label: "Quản lý Nhập Kho" },
        { key: "/admin/export", label: "Quản lý Xuất Thuốc" }, // Thêm mục này cho đầy đủ
      ],
    },
  ];

  // [MỚI] Hàm xử lý click menu cha
  const handleMenuClick = (key: string) => {
    setOpenMenuKey(openMenuKey === key ? null : key);
  };

  // [MỚI] Hàm kiểm tra xem 1 link con có active không
  const isChildActive = (children: any[]) => {
    return children.some((child) => location.pathname === child.key);
  };

  return (
    <div className={styles.sidebar}>
      <div>
        <img src={LogoSideBar} alt="Pharmacy Logo" className={styles.logoImg} />
      </div>
      <ul className={styles.menuList}>
        {menuItems.map((item) => {
          // [MỚI] Logic render menu cha
          if (item.children) {
            const isOpen = openMenuKey === item.key;
            const isActive = isChildActive(item.children); // Cha cũng active nếu con active

            return (
              <li key={item.key} className={styles.menuParent}>
                <div
                  className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
                  onClick={() => handleMenuClick(item.key)}
                >
                  <span className={styles.menuItemIcon} role="img" aria-label={item.label}>
                    {item.icon}
                  </span>
                  {item.label}
                  <span className={`${styles.menuArrow} ${isOpen ? styles.menuArrowOpen : ""}`}>▼</span>
                </div>
                {/* [MỚI] Render menu con với hiệu ứng */}
                <ul className={`${styles.submenu} ${isOpen ? styles.submenuOpen : ""}`}>
                  {item.children.map((child) => (
                    <Link
                      key={child.key}
                      to={child.key}
                      className={`${styles.submenuItemLink} ${
                        location.pathname === child.key ? styles.submenuActive : ""
                      }`}
                    >
                      <li className={styles.submenuItem}>{child.label}</li>
                    </Link>
                  ))}
                </ul>
              </li>
            );
          }

          // Render menu đơn như cũ
          return (
            <Link
              key={item.key}
              to={item.key}
              className={`${styles.menuItem} ${location.pathname.startsWith(item.key) ? styles.active : ""}`}
            >
              <span className={styles.menuItemIcon} role="img" aria-label={item.label}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminSidebar;
