// src/pages/Admin/Dashboard.tsx
import React, { useState, useEffect } from 'react';
// 1. Import từ các file API service thật
import { getWarningMedicines } from '../../api/dashboardApi';
import { getRevenueData } from '../../api/revenueApi';
// 2. Import interfaces
import { ThuocCanhBao, DuLieuDoanhThu } from '../../interfaces';

import styles from '../../styles/AdminDashboard.module.css';
// Giả sử bạn có các component này, nếu không có, hãy tạm ẩn chúng đi
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Định nghĩa một kiểu dữ liệu đơn giản cho summary
interface SummaryData {
  totalRevenue: number;
  totalPatients: number;
  lowStock: number;
}

const Dashboard: React.FC = () => {
  // 3. Cập nhật state để dùng interface mới và thêm loading/error
  const [summary, setSummary] = useState<SummaryData>({ totalRevenue: 0, totalPatients: 0, lowStock: 0 });
  const [warnings, setWarnings] = useState<ThuocCanhBao[]>([]);
  const [revenue, setRevenue] = useState<DuLieuDoanhThu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 4. Gọi đến các hàm API rỗng mới
        const warningData = await getWarningMedicines();
        const revenueData = await getRevenueData();
        
        setWarnings(warningData);
        setRevenue(revenueData);

        // Vì chúng ta chưa có API cho summary, ta sẽ đặt giá trị mặc định
        setSummary({
          totalRevenue: 0,
          totalPatients: 0, // Sẽ lấy từ API bệnh nhân
          lowStock: warningData.filter(w => w.LyDo === 'SapHetHang').length,
        });

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 5. Render với các trạng thái loading, error
  if (isLoading) {
    return <div className={styles.container}><p>Đang tải dữ liệu Dashboard...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p style={{ color: 'red' }}>Lỗi: {error}</p></div>;
  }



  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tổng quan</h1>
      
      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <h2>Tổng doanh thu</h2>
          <p>{summary.totalRevenue.toLocaleString()} VNĐ</p>
        </div>
        <div className={styles.summaryCard}>
          <h2>Tổng bệnh nhân</h2>
          <p>{summary.totalPatients}</p>
        </div>
        <div className={styles.summaryCard}>
          <h2>Thuốc sắp hết</h2>
          <p>{summary.lowStock}</p>
        </div>
      </div>

      {/* Charts and Warnings */}
 
        
        <div className={styles.warningList}>
          <h2>Cảnh báo</h2>
          {warnings.length > 0 ? (
            <ul>
              {warnings.map((warning) => (
                <li key={warning.MaThuoc} className={styles[warning.LyDo]}>
                  <strong>{warning.TenThuoc}</strong> ({warning.LyDo === 'SapHetHang' ? `Còn ${warning.SoLuongTon}` : `HSD: ${new Date(warning.HanSuDung).toLocaleDateString()}`})
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có cảnh báo nào.</p>
          )}
        </div>
      </div>
    
  );
};

export default Dashboard;