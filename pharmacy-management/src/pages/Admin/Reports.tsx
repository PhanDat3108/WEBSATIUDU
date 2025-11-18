// src/pages/Admin/Reports.tsx
import React, { useState, useEffect } from 'react';
import { getBaoCaoTonKho, getExpiryChartData } from '../../api/reportApi';
import { BaoCaoTonKho, Thuoc } from '../../interfaces';
import styles from '../../styles/AdminManagement.module.css';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports: React.FC = () => {
  const [report, setReport] = useState<BaoCaoTonKho | null>(null);
  const [chartData, setChartData] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [reportData, expiryData] = await Promise.all([
            getBaoCaoTonKho(),
            getExpiryChartData()
        ]);

        setReport(reportData);

        const formattedChartData = [
            { name: 'Bình thường', value: expiryData.BinhThuong },
            { name: 'Sắp hết hạn', value: expiryData.SapHetHan },
            { name: 'Đã hết hạn', value: expiryData.DaHetHan },
        ];
        setChartData(formattedChartData.filter(item => item.value > 0));

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, []);

  const renderThuocTable = (title: string, data: Thuoc[]) => (
    <div className={styles.reportSection}>
      <h2>{title} ({data ? data.length : 0})</h2>
      {data && data.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã Thuốc</th>
              <th>Tên Thuốc</th>
              <th>Số lượng tồn</th>
              <th>Đơn vị</th>
            </tr>
          </thead>
          <tbody>
            {data.map(thuoc => (
              <tr key={thuoc.MaThuoc}>
                <td>{thuoc.MaThuoc}</td>
                <td>{thuoc.TenThuoc}</td>
                <td>{thuoc.SoLuongTon}</td>
                <td>{thuoc.DonViTinh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có dữ liệu.</p>
      )}
    </div>
  );

  if (isLoading) return <div className={styles.container}><p>Đang tải báo cáo...</p></div>;
  if (error) return <div className={styles.container}><p style={{ color: 'red' }}>Lỗi: {error}</p></div>;
  if (!report) return <div className={styles.container}><p>Không có dữ liệu.</p></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Báo cáo Tổng quan</h1>
      
      {/* Phần thẻ tóm tắt */}
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

      {/* Phần biểu đồ */}
      <div className={styles.chartSection} style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '350px'
      }}>
          <h2>Tỷ lệ hạn sử dụng thuốc</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        // [SỬA LỖI TẠI ĐÂY] Dùng 'any' để bỏ qua lỗi kiểm tra type
                        label={({ name, percent }: any) => 
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [value, "Số lượng"]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
          </div>
      </div>
      
      {renderThuocTable('Thuốc sắp hết hàng (Tồn <= 10)', report.ThuocSapHetHang)}
      {renderThuocTable('Thuốc sắp hết hạn (30 ngày)', report.ThuocSapHetHan)}
      {renderThuocTable('Thuốc đã hết hạn', report.ThuocDaHetHan)}
    </div>
  );
};

export default Reports;