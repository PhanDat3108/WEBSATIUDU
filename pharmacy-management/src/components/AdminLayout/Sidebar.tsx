// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import styles from '../../styles/AdminLayout.module.css'; 

// const AdminSidebar: React.FC = () => {
//     const location = useLocation();

//     // Cập nhật menuItems:
//     const menuItems = [
//         { key: '/admin/dashboard', icon: '🏠', label: 'Trang chủ' },
//         { key: '/admin/medicines', icon: '💊', label: 'Quản lý thuốc' },
//         { key: '/admin/patients', icon: '👥', label: 'Quản lý bệnh nhân' },
//         { key: '/admin/employees', icon: '👨‍💼', label: 'Quản lý nhân viên' },
//         { key: '/admin/reports', icon: '📊', label: 'Thống kê' },
//         { key: '/admin/revenue', icon: '💰', label: 'Thu nhập' }, // <-- [MỤC MỚI]
//     ];

//     return (
//         <div className={styles.sidebar}>
//             <h3 className={styles.logo}>pharmacy</h3>
//             <ul className={styles.menuList}>
//                 {menuItems.map((item) => (
//                     <Link 
//                         key={item.key} 
//                         to={item.key} 
//                         className={`${styles.menuItem} ${location.pathname.startsWith(item.key) ? styles.active : ''}`}
//                     >
//                         <span className={styles.menuItemIcon} role="img" aria-label={item.label}>
//                             {item.icon}
//                         </span>
//                         {item.label}
//                     </Link>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default AdminSidebar;
// src/components/AdminLayout/Sidebar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../../styles/AdminLayout.module.css'; 

const AdminSidebar: React.FC = () => {
    const location = useLocation();
    
    // [MỚI] State để quản lý mục menu nào đang mở
    const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

    // [MỚI] Cấu trúc menu mới với menu con
    const menuItems = [
        { key: '/admin/dashboard', icon: '🏠', label: 'Trang chủ' },
        { 
            key: 'ql-thuoc', // Key cha
            icon: '💊', 
            label: 'Quản lý thuốc',
            children: [
                { key: '/admin/medicines', label: 'Quản lý số lượng' }, // (nguồn 214)
                { key: '/admin/suppliers', label: 'Quản lý nhà cung cấp' }, // [MỚI]
                { key: '/admin/categories', label: 'Quản lý loại thuốc' }, // [MỚI]
            ]
        },
         // [MỚI]
        { key: '/admin/patients', icon: '👥', label: 'Quản lý bệnh nhân' }, // (Giữ nguyên)
        { key: '/admin/employees', icon: '👨‍💼', label: 'Quản lý nhân viên' }, // (Giữ nguyên)
        { key: '/admin/reports', icon: '📊', label: 'Thống kê' }, // (Giữ nguyên)
        { key: '/admin/revenue', icon: '💰', label: 'Thu nhập' }, // (Giữ nguyên)
        { key: '/admin/history', icon: '📜', label: 'Lịch sử import/export' },
    ];

    // [MỚI] Hàm xử lý click menu cha
    const handleMenuClick = (key: string) => {
        setOpenMenuKey(openMenuKey === key ? null : key);
    };

    // [MỚI] Hàm kiểm tra xem 1 link con có active không
    const isChildActive = (children: any[]) => {
        return children.some(child => location.pathname === child.key);
    };

    return (
        <div className={styles.sidebar}>
            <h3 className={styles.logo}>pharmacy</h3>
            <ul className={styles.menuList}>
                {menuItems.map((item) => {
                    // [MỚI] Logic render menu cha
                    if (item.children) {
                        const isOpen = openMenuKey === item.key;
                        const isActive = isChildActive(item.children); // Cha cũng active nếu con active
                        
                        return (
                            <li key={item.key} className={styles.menuParent}>
                                <div 
                                    className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                                    onClick={() => handleMenuClick(item.key)}
                                >
                                    <span className={styles.menuItemIcon} role="img" aria-label={item.label}>{item.icon}</span>
                                    {item.label}
                                    <span className={`${styles.menuArrow} ${isOpen ? styles.menuArrowOpen : ''}`}>▼</span>
                                </div>
                                {/* [MỚI] Render menu con với hiệu ứng */}
                                <ul className={`${styles.submenu} ${isOpen ? styles.submenuOpen : ''}`}>
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.key}
                                            to={child.key}
                                            className={`${styles.submenuItemLink} ${location.pathname === child.key ? styles.submenuActive : ''}`}
                                        >
                                            <li className={styles.submenuItem}>
                                                {child.label}
                                            </li>
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
                            className={`${styles.menuItem} ${location.pathname.startsWith(item.key) ? styles.active : ''}`}
                        >
                            <span className={styles.menuItemIcon} role="img" aria-label={item.label}>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </ul>
        </div>
    );
};

export default AdminSidebar;