import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../../styles/AdminLayout.module.css'; 

const AdminSidebar: React.FC = () => {
    const location = useLocation();

    // Cập nhật menuItems:
    const menuItems = [
        { key: '/admin/dashboard', icon: '🏠', label: 'Trang chủ' },
        { key: '/admin/medicines', icon: '💊', label: 'Quản lý thuốc' },
        { key: '/admin/patients', icon: '👥', label: 'Quản lý bệnh nhân' },
        { key: '/admin/employees', icon: '👨‍💼', label: 'Quản lý nhân viên' },
        { key: '/admin/reports', icon: '📊', label: 'Thống kê' },
        { key: '/admin/revenue', icon: '💰', label: 'Thu nhập' }, // <-- [MỤC MỚI]
    ];

    return (
        <div className={styles.sidebar}>
            <h3 className={styles.logo}>pharmacy</h3>
            <ul className={styles.menuList}>
                {menuItems.map((item) => (
                    <Link 
                        key={item.key} 
                        to={item.key} 
                        className={`${styles.menuItem} ${location.pathname.startsWith(item.key) ? styles.active : ''}`}
                    >
                        <span className={styles.menuItemIcon} role="img" aria-label={item.label}>
                            {item.icon}
                        </span>
                        {item.label}
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default AdminSidebar;