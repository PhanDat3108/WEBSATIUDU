// src/pages/Admin/Revenue.tsx
import React, { useState, useEffect } from 'react';
// 1. Import hàm mới và interface
import { getRevenueData } from '../../api/revenueApi';
import { DuLieuDoanhThu } from '../../interfaces';

// 2. Import components biểu đồ
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

// Giả sử file style
import styles from '../../styles/AdminDashboard.module.css';

// Kiểu dữ liệu giả cho PieChart (vì ta chưa có API)
interface TopProduct {
  name: string;
  value: number;
  // SỬA LỖI Ở ĐÂY: Thêm dòng này để sửa lỗi TS2322
  [key: string]: any;
}
// Kiểu dữ liệu giả cho Summary (vì ta chưa có API)
interface RevenueSummary {
  total: number;
  profit: number;
  itemsSold: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Revenue: React.FC = () => {
  // 3. Cập nhật state
  const [summary, setSummary] = useState<RevenueSummary>({ total: 0, profit: 0, itemsSold: 0 });
  const [lineChartData, setLineChartData] = useState<DuLieuDoanhThu[]>([]);
  const [pieChartData, setPieChartData] = useState<TopProduct[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 4. Chỉ gọi hàm getRevenueData
        const lineData = await getRevenueData();
        setLineChartData(lineData);

        // 5. Đặt dữ liệu rỗng cho các phần chưa có API
        setSummary({ total: 0, profit: 0, itemsSold: 0 });
        setPieChartData([]); // API cho TopSellingProducts chưa được định nghĩa

      } catch (err) {
        // Lỗi này sẽ hiển thị "Chức năng chưa sẵn sàng"
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 6. Render với các trạng thái
  if (isLoading) {
    return <div className={styles.container}><p>Đang tải dữ liệu doanh thu...</p></div>;
  }

  // Hiển thị lỗi (nếu API reject)
  if (error && lineChartData.length === 0) {
    return <div className={styles.container}><p style={{ color: 'red' }}>Lỗi: {error}</p></div>;
  }
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Phân tích Doanh thu</h1>
      
      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <h2>Tổng Doanh thu</h2>
          <p>{summary.total.toLocaleString()} VNĐ</p>
        </div>
        <div className={styles.summaryCard}>
          <h2>Lợi nhuận</h2>
          <p>{summary.profit.toLocaleString()} VNĐ</p>
        </div>
        <div className={styles.summaryCard}>
          <h2>Sản phẩm đã bán</h2>
          <p>{summary.itemsSold}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className={styles.mainGrid}>
        <div className={styles.chartContainer}>
          <h2>Doanh thu theo thời gian</h2>
          {lineChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="thang" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="doanhThu" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <p>Không có dữ liệu doanh thu theo thời gian.</p>
          )}
        </div>
        
        <div className={styles.chartContainer}>
          <h2>Top sản phẩm bán chạy</h2>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Không có dữ liệu sản phẩm bán chạy.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Revenue;