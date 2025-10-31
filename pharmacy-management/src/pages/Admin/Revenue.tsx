import React, { useState, useEffect } from 'react';

// Import Chart.js và các component biểu đồ
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2'; // Import 2 loại biểu đồ

// Import API giả lập (Đã sửa lỗi và đồng bộ)
import * as revenueApi from '../../api/revenueApi';
import { ChartData } from '../../api/revenueApi'; // Import kiểu dữ liệu

// TÁI SỬ DỤNG CSS (Không xung đột)
import dashboardStyles from '../../styles/AdminDashboard.module.css'; 
import tableStyles from '../../styles/AdminManagement.module.css';

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
);

const Revenue: React.FC = () => {
    // State cho các thẻ thống kê
    const [summary, setSummary] = useState({ todayRevenue: 0, monthlyRevenue: 0, totalOrders: 0 });
    // State cho biểu đồ
    const [lineData, setLineData] = useState<ChartData | null>(null);
    const [pieData, setPieData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);

    // Dùng useEffect để gọi API giả lập khi component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Các hàm này đã được sửa để đọc từ mockDatabase
                const summaryData = await revenueApi.getRevenueSummary();
                const lineChartData = await revenueApi.getRevenueOverTime();
                const pieChartData = await revenueApi.getTopSellingProducts();
                
                setSummary(summaryData);
                setLineData(lineChartData);
                setPieData(pieChartData);

            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu giả lập:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Hiển thị loading
    if (loading) {
        return (
             <div className={`${tableStyles.managementContainer} animate__animated animate__fadeInRightBig animate__faster`}>
                <h2 className={tableStyles.title}>Đang tải dữ liệu thu nhập...</h2>
            </div>
        );
    }

    return (
        // [SỬA LỖI Z-INDEX] Thêm animation vào div nội dung
        <div className={`${tableStyles.managementContainer} animate__animated animate__fadeInRightBig animate__faster`}>
            <h2 className={tableStyles.title}>Quản lý Thu nhập</h2>
            
            {/* Tái sử dụng CSS từ Dashboard cho các thẻ thống kê */}
            <div className={dashboardStyles.statsGrid} style={{ marginBottom: '30px' }}>
                <div className={dashboardStyles.statCard} style={{minHeight: '150px'}}>
                    <p className={dashboardStyles.statTitle}>Thu nhập hôm nay:</p>
                    <p className={dashboardStyles.statValue}>{summary.todayRevenue.toLocaleString('vi-VN')} VNĐ</p>
                </div>
                <div className={dashboardStyles.statCard} style={{minHeight: '150px'}}>
                    <p className={dashboardStyles.statTitle}>Thu nhập tháng này:</p>
                    <p className={dashboardStyles.statValue}>{summary.monthlyRevenue.toLocaleString('vi-VN')} VNĐ</p>
                </div>
                <div className={dashboardStyles.statCard} style={{minHeight: '150px'}}>
                    <p className={dashboardStyles.statTitle}>Tổng đơn hàng (tháng):</p>
                    <p className={dashboardStyles.statValue}>{summary.totalOrders}</p>
                </div>
            </div>

            {/* Khu vực Biểu đồ */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                
                {/* Biểu đồ 1: Doanh thu (Line) */}
                <div className={dashboardStyles.welcomeCard} style={{ padding: '15px' }}>
                    <h3 style={{ textAlign: 'center' }}>Biểu đồ Doanh thu (Tháng)</h3>
                    {lineData && (
                        <Line 
                            data={lineData} 
                            options={{ responsive: true, plugins: { legend: { position: 'top' } } }} 
                        />
                    )}
                </div>

                {/* Biểu đồ 2: Sản phẩm (Pie) */}
                <div className={dashboardStyles.welcomeCard} style={{ padding: '15px' }}>
                    <h3 style={{ textAlign: 'center' }}>Sản phẩm bán chạy</h3>
                    {pieData && (
                        <Pie 
                            data={pieData}
                            options={{ responsive: true }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Revenue;