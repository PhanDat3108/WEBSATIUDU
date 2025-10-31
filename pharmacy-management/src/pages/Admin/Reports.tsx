import React, { useState, useEffect } from 'react';
import { Medicine } from '../../interfaces'; 

// TÁI SỬ DỤNG CSS:
import dashboardStyles from '../../styles/AdminDashboard.module.css'; 
import tableStyles from '../../styles/AdminManagement.module.css';

// [ĐỒNG BỘ] Import "Database Giả"
import { mockMedicines, mockPatients, mockTransactions } from '../../api/mockDatabase';

const Reports: React.FC = () => {
    // State cho các báo cáo chi tiết
    const [lowStockMedicines, setLowStockMedicines] = useState<Medicine[]>([]);
    const [expiringMedicines, setExpiringMedicines] = useState<Medicine[]>([]);

    // [ĐỒNG BỘ] Tính toán từ Database Giả
    const summaryStats = [
        // Tính tổng SL thuốc từ DB
        { title: 'Tổng số lượng thuốc', value: mockMedicines.reduce((sum, med) => sum + med.soLuong, 0) },
        // Tính tổng BN từ DB
        { title: 'Tổng số lượng bệnh nhân', value: mockPatients.length },
        // Giữ số liệu lịch sử (vì không có DB thật)
        { title: 'Số lượng thuốc đã nhập', value: 10000 },
        // Tính tổng SL bán từ DB
        { title: 'Số lượng thuốc đã bán', value: mockTransactions.reduce((sum, t) => sum + t.soLuongBan, 0) },
    ];

    // Chạy 1 lần khi component mount để lọc dữ liệu
    useEffect(() => {
        const today = new Date(); // Giả sử hôm nay là 31/10/2025
        const warningDateLimit = new Date();
        warningDateLimit.setDate(today.getDate() + 90); // Mốc 90 ngày

        // [ĐỒNG BỘ] Dùng mockMedicines đã import
        // 1. Lọc thuốc sắp hết hàng (ví dụ: SL < 20)
        const lowStock = mockMedicines.filter(m => m.soLuong < 20);
        setLowStockMedicines(lowStock);

        // 2. Lọc thuốc sắp hết hạn (trong 90 ngày tới) hoặc đã hết hạn
        const expiring = mockMedicines.filter(m => {
            const expiryDate = new Date(m.hsd);
            return expiryDate <= warningDateLimit;
        });
        // Sắp xếp HSD gần nhất
        setExpiringMedicines(expiring.sort((a, b) => new Date(a.hsd).getTime() - new Date(b.hsd).getTime())); 

    }, []); // Chỉ chạy 1 lần

    return (
        // [SỬA LỖI Z-INDEX] Thêm animation vào div nội dung
        <div className={`${tableStyles.managementContainer} animate__animated animate__fadeInRightBig animate__faster`}>
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