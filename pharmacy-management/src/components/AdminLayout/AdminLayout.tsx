import React from 'react';
// [ĐÃ SỬA] Xóa useLocation, chỉ import Outlet
import { Outlet } from 'react-router-dom';
import AdminSidebar from './Sidebar';
import styles from '../../styles/AdminLayout.module.css';

const AdminLayout: React.FC = () => {
  return (
    <div className={styles.layoutContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        
        {/* [ĐÃ SỬA] Xóa div animation.
           Trả <main> và <Outlet> về trạng thái gốc.
           Điều này sẽ sửa lỗi z-index.
        */}
        <main>
          <Outlet /> 
        </main>
        
      </div>
    </div>
  );
};

export default AdminLayout;