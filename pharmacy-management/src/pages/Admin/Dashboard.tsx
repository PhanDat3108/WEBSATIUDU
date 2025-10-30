import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/AdminDashboard.module.css';

const AdminDashboard: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* Welcome Card */}
      <div className={styles.welcomeCard}>
        <p className={styles.welcomeText}>Xin chào !!!</p>
        <p className={styles.returnText}>Mừng quay trở lại!</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        
        {/* Số lượng bệnh nhân */}
        <div className={styles.statCard}>
          <p className={styles.statTitle}>Số lượng bệnh nhân:</p>
          <p className={styles.statValue}>50</p>
          <Link to="/admin/patients" className={styles.detailButton}>
            Xem chi tiết
          </Link>
        </div>

        {/* Tổng số lượng thuốc trong kho */}
        <div className={styles.statCard}>
          <p className={styles.statTitle}>Tổng số lượng thuốc trong kho:</p>
          <p className={styles.statValue}>5000</p>
          <Link to="/admin/medicines" className={styles.detailButton}>
            Xem chi tiết
          </Link>
        </div>

        {/* Số lượng thuốc đã nhập */}
        <div className={styles.statCard}>
          <p className={styles.statTitle}>Số lượng thuốc đã nhập:</p>
          <p className={styles.statValue}>10.000</p>
          <Link to="/admin/reports" className={styles.detailButton}>
            Xem chi tiết
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;