// src/pages/Admin/PhieuNhapManagement.tsx
import React, { useState, useEffect } from 'react';
import { getChiTietNhapList } from '../../api/phieuNhapApi';
import { ChiTietNhapLichSu } from '../../interfaces';
import styles from '../../styles/AdminManagement.module.css'; 

// [SỬA] Import Modal MỚI
import ModalWithAnimation from '../../components/common/ModalWithAnimation'; 
import { PhieuNhapForm } from '../../components/AdminForms/PhieuNhapForm';
import modalStyles from '../../styles/Modal.module.css';

// --- Helper Functions (Hàm hỗ trợ) ---

const formatDate = (isoString: string) => {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error("Lỗi format ngày:", isoString, error);
    return "Ngày lỗi";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount);
};

// --- Main Component (Component chính) ---

export const PhieuNhapManagement = () => {
  const [history, setHistory] = useState<ChiTietNhapLichSu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State để quản lý việc mở/đóng Modal MỚI
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getChiTietNhapList();
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

  // Hàm xử lý khi bấm nút "Thêm Phiếu Nhập"
  const handleAddClick = () => {
    setIsModalOpen(true); 
  };
  
  // Hàm để xử lý khi Form được lưu thành công
  const handleSaveSuccess = () => {
    setIsModalOpen(false); // Đóng Modal
    fetchData(); // Tải lại danh sách lịch sử
  };

  return (
    <div className={styles.adminManagementPage}>
      {/* Header của trang */}
      <header className={styles.header}>
        <h1>Lịch Sử Nhập Thuốc</h1>
        <button onClick={handleAddClick} className={styles.addButton}>
          + Thêm Phiếu Nhập
        </button>
      </header>

      {/* Hiển thị trạng thái tải hoặc lỗi */}
      {isLoading && <div className={styles.loading}>Đang tải dữ liệu...</div>}
      {error && <div className={styles.error}>Lỗi: {error}</div>}

      {/* Hiển thị bảng dữ liệu */}
      {!isLoading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã Phiếu</th>
                <th>Ngày Nhập</th>
                <th>Tên Thuốc</th>
                <th>Nhà Cung Cấp</th>
                <th>Số Lượng</th>
                <th>Đơn Giá Nhập</th>
                <th>Hạn Sử Dụng</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item, index) => (
                  <tr key={`${item.MaPhieuNhap}-${item.TenThuoc}-${index}`}>
                    <td>{item.MaPhieuNhap}</td>
                    <td>{formatDate(item.NgayNhap)}</td>
                    <td>{item.TenThuoc}</td>
                    <td>{item.TenNhaCungCap}</td>
                    <td className={styles.numberCell}>{item.SoLuongNhap}</td>
                    <td className={styles.numberCell}>{formatCurrency(item.DonGiaNhap)}</td>
                    <td>{formatDate(item.HanSuDung)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>Chưa có lịch sử nhập hàng.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* [SỬA] Sử dụng ModalWithAnimation và truyền 'isOpen' */}
      <ModalWithAnimation 
        title="Tạo Phiếu Nhập Mới" 
        isOpen={isModalOpen} // Truyền state vào prop 'isOpen'
        onClose={() => setIsModalOpen(false)}
        customClass={modalStyles.modalLarge} // Giờ prop này đã hoạt động
      >
        <PhieuNhapForm
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSuccess}
        />
      </ModalWithAnimation>
    </div>
  );
};
export default PhieuNhapManagement;