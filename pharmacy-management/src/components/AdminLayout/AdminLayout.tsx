import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './Sidebar';
import styles from '../../styles/AdminLayout.module.css';

const AdminLayout: React.FC = () => {
  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar - Cố định */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        <main>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;