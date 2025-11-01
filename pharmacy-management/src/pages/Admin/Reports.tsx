// src/pages/Admin/Reports.tsx
import React, { useState, useEffect } from 'react';
// 1. Import API mới và Interfaces
import { getBaoCaoTonKho } from '../../api/reportApi';
import { BaoCaoTonKho, Thuoc } from '../../interfaces';
// 2. Tái sử dụng style (hoặc dùng style riêng)
import styles from '../../styles/AdminManagement.module.css';

const Reports: React.FC = () => {
  // 3. State cho báo cáo, loading, lỗi
  const [report, setReport] = useState<BaoCaoTonKho | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // 4. Gọi API mới
        const data = await getBaoCaoTonKho();
        setReport(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, []);

  // 5. Hàm helper để render bảng
  const renderThuocTable = (title: string, data: Thuoc[]) => (
    <div className={styles.reportSection}>
      <h2>{title} ({data.length})</h2>
      {data.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã Thuốc</th>
              <th>Tên Thuốc</th>
              <th>Số lượng tồn</th>
              <th>Hạn Sử Dụng</th>
            </tr>
          </thead>
          <tbody>
            {data.map(thuoc => (
              <tr key={thuoc.MaThuoc}>
                <td>{thuoc.MaThuoc}</td>
                <td>{thuoc.TenThuoc}</td>
                <td>{thuoc.SoLuongTon}</td>
                <td>{new Date(thuoc.HanSuDung).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có dữ liệu.</p>
      )}
    </div>
  );
  
  // 6. Render chính với các trạng thái
  if (isLoading) {
    return <div className={styles.container}><p>Đang tải báo cáo...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p style={{ color: 'red' }}>Lỗi: {error}</p></div>;
  }

  if (!report) {
    return <div className={styles.container}><p>Không có dữ liệu báo cáo.</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Báo cáo Tồn kho</h1>
      
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <h2>Tổng số loại thuốc</h2>
          <p>{report.TongSoLoaiThuoc}</p>
        </div>
        <div className={styles.summaryCard}>
          <h2>Tổng số lượng tồn</h2>
          <p>{report.TongSoLuongTon}</p>
        </div>
      </div>
      
      {renderThuocTable('Thuốc sắp hết hàng', report.ThuocSapHetHang)}
      {renderThuocTable('Thuốc sắp hết hạn', report.ThuocSapHetHan)}
      {renderThuocTable('Thuốc đã hết hạn', report.ThuocDaHetHan)}
    </div>
  );
};

export default Reports;