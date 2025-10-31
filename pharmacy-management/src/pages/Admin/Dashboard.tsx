import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/AdminDashboard.module.css'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getExpiryStatusReport } from '../../api/dashboardApi';
import { mockMedicines, mockPatients } from '../../api/mockDatabase';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartData { labels: string[]; datasets: any[]; }

const AdminDashboard: React.FC = () => {
    
    const [expiryData, setExpiryData] = useState<PieChartData | null>(null);
    const [loadingChart, setLoadingChart] = useState(true);

    const totalStock = mockMedicines.reduce((sum, med) => sum + med.soLuong, 0);
    const totalPatients = mockPatients.length;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const report = await getExpiryStatusReport();
                const data = {
                    labels: [
                        `Hết hạn (${report.expired})`, 
                        `Sắp hết hạn (<= 90 ngày) (${report.expiringSoon})`, 
                        `Còn dùng tốt (${report.good})`
                    ],
                    datasets: [
                        {
                            label: 'Tình trạng thuốc',
                            data: [report.expired, report.expiringSoon, report.good],
                            backgroundColor: ['#dc3545', '#ffc107', '#28a745'],
                            borderColor: '#ffffff',
                            borderWidth: 2,
                        },
                    ],
                };
                setExpiryData(data);
            } catch (err) {
                console.error("Lỗi tải báo cáo HSD:", err);
            } finally {
                setLoadingChart(false);
            }
        };
        fetchData();
    }, []);

    return (
        // [ĐÃ SỬA] Thêm animation vào div nội dung
        <div className={`${styles.dashboardContainer} animate__animated animate__fadeInRightBig animate__faster`}>
            {/* Welcome Card */}
            <div className={styles.welcomeCard}>
                <p className={styles.welcomeText}>Xin chào A</p>
                <p className={styles.returnText}>Mừng quay trở lại!</p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {/* Card 1: Bệnh nhân */}
                <div className={styles.statCard}>
                    <p className={styles.statTitle}>Số lượng bệnh nhân:</p>
                    <p className={styles.statValue}>{totalPatients}</p>
                    <Link to="/admin/patients" className={styles.detailButton}>Xem chi tiết</Link>
                </div>

                {/* Card 2: Thuốc trong kho */}
                <div className={styles.statCard}>
                    <p className={styles.statTitle}>Tổng số lượng thuốc trong kho:</p>
                    <p className={styles.statValue}>{totalStock}</p>
                    
                    <div style={{ height: '160px', position: 'relative', margin: '15px auto', width: '100%' }}>
                        {loadingChart ? (
                            <p style={{ textAlign: 'center', fontSize: '0.9em' }}>Đang tải dữ liệu HSD...</p>
                        ) : (
                            expiryData && (
                                <Pie 
                                    data={expiryData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false, 
                                        plugins: {
                                            legend: {
                                                position: 'bottom', 
                                                labels: { boxWidth: 12, font: { size: 10 }, padding: 10 }
                                            }
                                        }
                                    }}
                                />
                            )
                        )}
                    </div>
                    
                    <Link to="/admin/medicines" className={styles.detailButton}>Xem chi tiết</Link>
                </div>

                {/* Card 3: Thuốc đã nhập */}
                <div className={styles.statCard}>
                    <p className={styles.statTitle}>Số lượng thuốc đã nhập:</p>
                    <p className={styles.statValue}>10.000</p>
                    <Link to="/admin/reports" className={styles.detailButton}>Xem chi tiết</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;