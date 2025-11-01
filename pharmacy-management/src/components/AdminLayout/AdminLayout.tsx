// src/components/AdminLayout/AdminLayout.tsx
import React from 'react';
// 1. Chỉ import Outlet, xóa useLocation
import { Outlet } from 'react-router-dom'; 
import Sidebar from './Sidebar';
import styles from '../../styles/AdminLayout.module.css';

const AdminLayout: React.FC = () => {

  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      {/* 2. XÓA BỎ key và các class animation khỏi <main> */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;