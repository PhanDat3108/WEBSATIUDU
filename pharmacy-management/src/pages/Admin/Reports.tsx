import React, { useState, useEffect } from 'react';
import { Medicine } from '../../interfaces'; // Import type Medicine

// TÁI SỬ DỤNG CSS:
// 1. Import CSS của Dashboard để dùng layout Card
import dashboardStyles from '../../styles/AdminDashboard.module.css'; 
// 2. Import CSS của Management để dùng layout Bảng Grid
import tableStyles from '../../styles/AdminManagement.module.css';

// --- Dữ liệu giả lập cho Báo cáo (Thêm thuốc sắp hết/hết hạn) ---
// (Trong thực tế, bạn sẽ fetch từ API)
const mockMedicinesData: Medicine[] = [
    { id: 1, stt: 1, maThuoc: 'PARA100', tenThuoc: 'Paracetamol 500mg', loaiThuoc: 'Giảm đau, hạ sốt', soLuong: 150, hsd: '2026-10-30', nhaCungCap: 'Traphaco', ngayNhap: '2024-10-30' },
    { id: 2, stt: 2, maThuoc: 'AMO500', tenThuoc: 'Amoxicillin 500mg', loaiThuoc: 'Kháng sinh', soLuong: 80, hsd: '2025-05-15', nhaCungCap: 'Hậu Giang', ngayNhap: '2024-05-15' },
    // Cảnh báo: Sắp hết hàng
    { id: 3, stt: 3, maThuoc: 'VITC100', tenThuoc: 'Vitamin C 100mg', loaiThuoc: 'Vitamin', soLuong: 15, hsd: '2027-01-20', nhaCungCap: 'Traphaco', ngayNhap: '2024-01-20' },
    // Cảnh báo: Sắp hết hạn (Giả sử hôm nay là 31/10/2025)
    { id: 4, stt: 4, maThuoc: 'BERG10', tenThuoc: 'Berberin 10mg', loaiThuoc: 'Tiêu hóa', soLuong: 50, hsd: '2025-12-01', nhaCungCap: 'Nam Hà', ngayNhap: '2024-12-01' },
    { id: 5, stt: 5, maThuoc: 'OPI05', tenThuoc: 'Omeprazol 20mg', loaiThuoc: 'Dạ dày', soLuong: 120, hsd: '2026-08-01', nhaCungCap: 'Hậu Giang', ngayNhap: '2024-08-01' },
    // Cảnh báo: Hết hạn
    { id: 6, stt: 6, maThuoc: 'ASP100', tenThuoc: 'Aspirin 100mg', loaiThuoc: 'Chống đông máu', soLuong: 40, hsd: '2025-01-01', nhaCungCap: 'Traphaco', ngayNhap: '2024-01-01' },
];
// ----------------------------------------------------------------

const Reports: React.FC = () => {
    // State cho các báo cáo chi tiết
    const [lowStockMedicines, setLowStockMedicines] = useState<Medicine[]>([]);
    const [expiringMedicines, setExpiringMedicines] = useState<Medicine[]>([]);

    // State cho các thẻ thống kê (lấy từ ảnh của bạn)
    const summaryStats = [
        { title: 'Tổng số lượng thuốc', value: 5000 },
        { title: 'Tổng số lượng bệnh nhân', value: 50 },
        { title: 'Số lượng thuốc đã nhập', value: 10000 },
        { title: 'Số lượng thuốc đã bán', value: 8000 },
        { title: 'Số lượng thuốc hết hạn', value: 100 },
    ];

    // Chạy 1 lần khi component mount để lọc dữ liệu
    useEffect(() => {
        const today = new Date();
        // Mốc 90 ngày tới
        const warningDateLimit = new Date();
        warningDateLimit.setDate(today.getDate() + 90); 

        // 1. Lọc thuốc sắp hết hàng (ví dụ: SL < 20)
        const lowStock = mockMedicinesData.filter(m => m.soLuong < 20);
        setLowStockMedicines(lowStock);

        // 2. Lọc thuốc sắp hết hạn (trong 90 ngày tới) hoặc đã hết hạn
        const expiring = mockMedicinesData.filter(m => {
            const expiryDate = new Date(m.hsd);
            return expiryDate <= warningDateLimit;
        });
        setExpiringMedicines(expiring.sort((a, b) => new Date(a.hsd).getTime() - new Date(b.hsd).getTime())); // Sắp xếp HSD gần nhất

    }, []);

    return (
        // Dùng CSS của trang Quản lý
        <div className={tableStyles.managementContainer}>
            <h2 className={tableStyles.title}>Thống kê & Báo cáo</h2>

            {/* Phần 1: Thống kê tổng quan (Dùng CSS của Dashboard) */}
            <div className={dashboardStyles.statsGrid} style={{ marginBottom: '30px' }}>
                {summaryStats.map(stat => (
                    <div className={dashboardStyles.statCard} key={stat.title} style={{minHeight: '150px'}}>
                        <p className={dashboardStyles.statTitle}>{stat.title}:</p>
                        <p className={dashboardStyles.statValue}>{stat.value.toLocaleString('vi-VN')}</p>
                    </div>
                ))}
            </div>

            {/* Phần 2: Báo cáo chi tiết (Dùng CSS của Management) */}
            <h3 className={tableStyles.title} style={{fontSize: '1.5em', borderTop: '1px solid #eee', paddingTop: '20px'}}>
                Báo cáo Cảnh báo
            </h3>

            {/* Báo cáo Tồn kho thấp */}
            <div>
                <h4 style={{ color: '#dc3545' }}>Cảnh báo: Thuốc sắp hết hàng (SL &lt; 20)</h4>
                <div 
                    className={tableStyles.gridTable}
                    // Tùy chỉnh cột cho báo cáo này
                    style={{ gridTemplateColumns: '50px 1fr 1fr 150px' }}
                >
                    <div className={tableStyles.gridHeader}>
                        <div>STT</div>
                        <div>Mã thuốc</div>
                        <div>Tên thuốc</div>
                        <div>Số lượng còn lại</div>
                    </div>
                    {lowStockMedicines.length > 0 ? lowStockMedicines.map((thuoc, index) => (
                        <div className={tableStyles.gridRow} key={thuoc.id}>
                            <div className={tableStyles.gridCell}>{index + 1}</div>
                            <div className={tableStyles.gridCell}>{thuoc.maThuoc}</div>
                            <div className={tableStyles.gridCell}>{thuoc.tenThuoc}</div>
                            <div className={tableStyles.gridCell} style={{ color: '#dc3545', fontWeight: 'bold' }}>
                                {thuoc.soLuong}
                            </div>
                        </div>
                    )) : (
                        <div className={tableStyles.gridCell} style={{gridColumn: '1 / -1', textAlign: 'center'}}>Không có thuốc nào sắp hết hàng.</div>
                    )}
                </div>
            </div>

            {/* Báo cáo Hết hạn */}
            <div style={{ marginTop: '30px' }}>
                <h4 style={{ color: '#ffc107' }}>Cảnh báo: Thuốc sắp hết hạn & đã hết hạn (trong 90 ngày tới)</h4>
                <div 
                    className={tableStyles.gridTable}
                    // Tùy chỉnh cột
                    style={{ gridTemplateColumns: '50px 1fr 1fr 150px' }}
                >
                    <div className={tableStyles.gridHeader}>
                        <div>STT</div>
                        <div>Mã thuốc</div>
                        <div>Tên thuốc</div>
                        <div>Hạn sử dụng</div>
                    </div>
                    {expiringMedicines.length > 0 ? expiringMedicines.map((thuoc, index) => (
                        <div className={tableStyles.gridRow} key={thuoc.id}>
                            <div className={tableStyles.gridCell}>{index + 1}</div>
                            <div className={tableStyles.gridCell}>{thuoc.maThuoc}</div>
                            <div className={tableStyles.gridCell}>{thuoc.tenThuoc}</div>
                            <div className={tableStyles.gridCell} style={{ color: new Date(thuoc.hsd) < new Date() ? '#dc3545' : '#E8A317', fontWeight: 'bold' }}>
                                {thuoc.hsd}
                                {new Date(thuoc.hsd) < new Date() && ' (Đã hết hạn)'}
                            </div>
                        </div>
                    )) : (
                        <div className={tableStyles.gridCell} style={{gridColumn: '1 / -1', textAlign: 'center'}}>Không có thuốc nào sắp hết hạn.</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Reports;