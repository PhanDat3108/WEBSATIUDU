// src/pages/Admin/XuatNoiBoManagement.tsx
import React, { useState, useEffect } from 'react';
import { phieuXuatApi } from '../../api/phieuXuatApi'; // Lấy danh sách từ đây
import { XuatNoiBoHistory } from '../../interfaces';
import styles from '../../styles/AdminManagement.module.css'; 

// Imports cho Modal và Form
import ModalWithAnimation from '../../components/common/ModalWithAnimation';
import { XuatNoiBoForm } from '../../components/AdminForms/XuatNoiBoForm';
import modalStyles from '../../styles/Modal.module.css';

const formatDate = (isoString: string) => {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) { return "Ngày lỗi"; }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount);
};

export const XuatNoiBoManagement = () => {
  const [history, setHistory] = useState<XuatNoiBoHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm lấy dữ liệu: Gọi phieuXuatApi.getAllDetails()
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await phieuXuatApi.getAllDetails();
      setHistory(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };
  
  const handleSaveSuccess = () => {
    setIsModalOpen(false); 
    fetchData(); // Tải lại bảng sau khi thêm thành công
  };

  return (
    <div className={styles.adminManagementPage}>
      <header className={styles.header}>
        <h1>Quản Lý Xuất Kho (Toàn bộ)</h1>
        <button onClick={handleAddClick} className={styles.addButton}>
          + Xuất Nội Bộ / Hủy
        </button>
      </header>

      {isLoading && <div className={styles.loading}>Đang tải dữ liệu...</div>}
      {error && <div className={styles.error}>Lỗi: {error}</div>}

      {!isLoading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã PX</th>
                <th>Ngày Xuất</th>
                <th>Loại Xuất</th>
                <th>Tên Thuốc</th>
                <th>Nhân Viên</th>
                <th>Số Lượng</th>
                <th>Đơn Giá</th>
                <th>Thành Tiền</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item, index) => (
                  <tr key={`${item.MaPhieuXuat}-${index}`}>
                    <td>{item.MaPhieuXuat}</td>
                    <td>{formatDate(item.NgayXuat)}</td>
                    <td>
                       <span style={{
                          padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem',
                          backgroundColor: item.LoaiXuat === 'Bán' ? '#e6f7ff' : (item.LoaiXuat === 'Bỏ' ? '#fff1f0' : '#f6ffed'),
                          color: item.LoaiXuat === 'Bán' ? '#1890ff' : (item.LoaiXuat === 'Bỏ' ? '#cf1322' : '#389e0d'),
                       }}>
                        {item.LoaiXuat}
                      </span>
                    </td>
                    <td>{item.TenThuoc}</td>
                    <td>{item.TenNhanVien}</td>
                    <td className={styles.numberCell}>{item.SoLuongXuat}</td>
                    <td className={styles.numberCell}>{formatCurrency(item.DonGiaXuat)}</td>
                    <td className={styles.numberCell}>
                      {formatCurrency(item.SoLuongXuat * item.DonGiaXuat)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{textAlign: 'center'}}>Chưa có dữ liệu xuất kho.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Render Modal Form */}
      <ModalWithAnimation 
        title="Tạo Phiếu Xuất Kho Nội Bộ" 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customClass={modalStyles.modalLarge} 
      >
        {/* Form này (bạn đã có code) sẽ gọi API addXuatNoiBo */}
        <XuatNoiBoForm
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSuccess}
        />
      </ModalWithAnimation>
    </div>
  );
};