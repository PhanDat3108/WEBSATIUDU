// src/pages/Admin/PhieuNhapManagement.tsx
import React, { useState, useEffect } from 'react';
import { getChiTietNhapList } from '../../api/phieuNhapApi';
import { ChiTietNhapLichSu } from '../../interfaces';
import styles from '../../styles/AdminManagement.module.css'; 

import ModalWithAnimation from '../../components/common/ModalWithAnimation'; 
import { PhieuNhapForm } from '../../components/AdminForms/PhieuNhapForm';
import modalStyles from '../../styles/Modal.module.css';

const formatDate = (isoString: string) => {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    return "Ngày lỗi";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount);
};

export const PhieuNhapManagement = () => {
  const [history, setHistory] = useState<ChiTietNhapLichSu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleAddClick = () => {
    setIsModalOpen(true); 
  };
  
  const handleSaveSuccess = () => {
    setIsModalOpen(false); 
    fetchData(); 
  };

  return (
    <div className={styles.adminManagementPage}>
      <header className={styles.header}>
        <h1>Lịch Sử Nhập Thuốc & Quản Lý Lô</h1>
        <button onClick={handleAddClick} className={styles.addButton}>
          + Nhập Hàng Mới
        </button>
      </header>

      {isLoading && <div className={styles.loading}>Đang tải dữ liệu...</div>}
      {error && <div className={styles.error}>Lỗi: {error}</div>}

      {!isLoading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã Phiếu</th>
                <th>Ngày Nhập</th>
                <th>Tên Thuốc</th>
                <th>Nhà Cung Cấp</th>
                <th>SL Nhập</th>
                <th>Tồn Lô</th> 
                <th>Đơn Giá</th>
                <th>Hạn Sử Dụng</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item, index) => {
                  // Kiểm tra xem lô này đã bán hết chưa
                  const isSoldOut = item.SoLuongConLai === 0;
                  // Kiểm tra sắp hết hạn (ví dụ: còn 30 ngày)
                  const isExpiringSoon = new Date(item.HanSuDung).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000;

                  return (
                    <tr 
                      key={`${item.MaPhieuNhap}-${item.TenThuoc}-${index}`}
                      style={{ 
                        opacity: isSoldOut ? 0.5 : 1, // Làm mờ nếu đã bán hết
                        backgroundColor: isSoldOut ? '#f9f9f9' : 'white' 
                      }}
                    >
                      <td>{item.MaPhieuNhap}</td>
                      <td>{formatDate(item.NgayNhap)}</td>
                      <td style={{ fontWeight: '500' }}>{item.TenThuoc}</td>
                      <td>{item.TenNhaCungCap}</td>
                      
                      <td className={styles.numberCell}>{item.SoLuongNhap}</td>
                      
                      {/* [MỚI] Hiển thị số lượng còn lại */}
                      <td className={styles.numberCell} style={{ 
                          fontWeight: 'bold', 
                          color: isSoldOut ? '#999' : '#2ecc71' // Xanh lá nếu còn, xám nếu hết
                      }}>
                        {item.SoLuongConLai}
                      </td>

                      <td className={styles.numberCell}>{formatCurrency(item.DonGiaNhap)}</td>
                      
                      <td style={{ 
                          color: (!isSoldOut && isExpiringSoon) ? '#e74c3c' : 'inherit', // Đỏ nếu sắp hết hạn và vẫn còn hàng
                          fontWeight: (!isSoldOut && isExpiringSoon) ? 'bold' : 'normal'
                      }}>
                        {formatDate(item.HanSuDung)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                    Chưa có dữ liệu nhập kho.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ModalWithAnimation 
        title="Tạo Phiếu Nhập Mới" 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        customClass={modalStyles.modalLarge}
      >
        <PhieuNhapForm
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSuccess}
        />
      </ModalWithAnimation>
    </div>
  );
};