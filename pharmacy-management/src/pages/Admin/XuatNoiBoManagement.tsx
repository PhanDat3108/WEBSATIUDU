// src/pages/Admin/XuatNoiBoManagement.tsx
import React, { useState, useEffect } from 'react';
import { getXuatNoiBoHistory } from '../../api/xuatNoiBoApi';
import { XuatNoiBoHistory } from '../../interfaces';
import styles from '../../styles/AdminManagement.module.css'; 

// Imports cho Modal và Form
import ModalWithAnimation from '../../components/common/ModalWithAnimation';
import { XuatNoiBoForm } from '../../components/AdminForms/XuatNoiBoForm';
import modalStyles from '../../styles/Modal.module.css';

// Copy 2 hàm helpers (formatDate, formatCurrency) từ PhieuNhapManagement.tsx
const formatDate = (isoString: string) => {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getXuatNoiBoHistory();
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
    fetchData(); // Tải lại lịch sử
  };

  return (
    <div className={styles.adminManagementPage}>
      <header className={styles.header}>
        <h1>Lịch Sử Xuất Kho Nội Bộ (Bỏ/Khác)</h1>
        <button onClick={handleAddClick} className={styles.addButton}>
          + Thêm Phiếu Xuất
        </button>
      </header>

      {isLoading && <div className={styles.loading}>Đang tải dữ liệu...</div>}
      {error && <div className={styles.error}>Lỗi: {error}</div>}

      {!isLoading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã Phiếu Xuất</th>
                <th>Ngày Xuất</th>
                <th>Loại Xuất</th>
                <th>Tên Thuốc</th>
                <th>Người Xuất</th>
                <th>Số Lượng</th>
                <th>Giá Vốn (Đơn vị)</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item, index) => (
                  <tr key={`${item.MaPhieuXuat}-${item.TenThuoc}-${index}`}>
                    <td>{item.MaPhieuXuat}</td>
                    <td>{formatDate(item.NgayXuat)}</td>
                    <td>{item.LoaiXuat}</td>
                    <td>{item.TenThuoc}</td>
                    <td>{item.TenNhanVien}</td>
                    <td className={styles.numberCell}>{item.SoLuongXuat}</td>
                    <td className={styles.numberCell}>{formatCurrency(item.DonGiaXuat)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>Chưa có lịch sử xuất nội bộ.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Render Modal */}
      <ModalWithAnimation 
        title="Tạo Phiếu Xuất Kho Nội Bộ" 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customClass={modalStyles.modalLarge} 
      >
        <XuatNoiBoForm
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSuccess}
        />
      </ModalWithAnimation>
    </div>
  );
};
