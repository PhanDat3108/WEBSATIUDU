// src/pages/Admin/PhieuNhapManagement.tsx
import React, { useState, useEffect } from "react";
import { getChiTietNhapList } from "../../api/phieuNhapApi";
import { ChiTietNhapLichSu } from "../../interfaces";
import styles from "../../styles/AdminManagement.module.css";

import ModalWithAnimation from "../../components/common/ModalWithAnimation";
import { PhieuNhapForm } from "../../components/AdminForms/PhieuNhapForm";
import modalStyles from "../../styles/Modal.module.css";

// [MỚI] Import Hook phân trang (nhớ kiểm tra đường dẫn đúng với thư mục bạn tạo)
import { usePagination } from "../../components/common/usePagination";

const formatDate = (isoString: string) => {
  if (!isoString) return "N/A";
  try {
    return new Date(isoString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return "Ngày lỗi";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const PhieuNhapManagement = () => {
  const [history, setHistory] = useState<ChiTietNhapLichSu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // [THAY THẾ] Bỏ hết state currentPage, itemsPerPage cũ.
  // Dùng 1 dòng này để lấy dữ liệu đã cắt (currentData) và thanh phân trang (PaginationComponent)
  const { currentData, PaginationComponent } = usePagination(history, 5);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getChiTietNhapList();
      const sortedData = data.sort((a: any, b: any) => 
        new Date(b.NgayNhap).getTime() - new Date(a.NgayNhap).getTime()
      );
      setHistory(sortedData);
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

  const renderStatus = (soLuong: number) => {
    if (soLuong === 0) {
      return (
        <span style={{ backgroundColor: "#ffebee", color: "#c62828", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", display: "inline-block", whiteSpace: "nowrap", border: "1px solid #ffcdd2" }}>
          Hết hàng
        </span>
      );
    } else if (soLuong <= 10) {
      return (
        <span style={{ backgroundColor: "#fff8e1", color: "#f57f17", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", display: "inline-block", whiteSpace: "nowrap", border: "1px solid #ffecb3" }}>
          Sắp hết
        </span>
      );
    } else {
      return (
        <span style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", display: "inline-block", whiteSpace: "nowrap", border: "1px solid #c8e6c9" }}>
          Còn hàng
        </span>
      );
    }
  };

  return (
    <div 
      className={styles.adminManagementPage} 
      style={{ display: "flex", flexDirection: "column", minHeight: "85vh" }}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>Lịch sử nhập thuốc & quản lý lô</h1>
        <button onClick={handleAddClick} className={styles.addButton}>
          + Nhập hàng mới
        </button>
      </header>

      {isLoading && <div className={styles.loading}>Đang tải dữ liệu...</div>}
      {error && <div className={styles.error}>Lỗi: {error}</div>}

      {!isLoading && !error && (
        <>
          <div className={styles.tableContainer} style={{ flex: 1 }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader} style={{ width: "80px" }}>Mã</th>
                  <th className={styles.tableHeader} style={{ width: "100px" }}>Ngày nhập</th>
                  <th className={styles.tableHeader}>Tên thuốc</th>
                  <th className={styles.tableHeader}>Nhà cung cấp</th>
                  <th className={styles.tableHeader} style={{ width: "80px", textAlign: "center" }}>SL Nhập</th>
                  <th className={styles.tableHeader} style={{ width: "80px", textAlign: "center" }}>Tồn kho</th>
                  <th className={styles.tableHeader} style={{ width: "120px", textAlign: "center" }}>Trạng thái</th>
                  <th className={styles.tableHeader} style={{ width: "100px" }}>Đơn giá</th>
                  <th className={styles.tableHeader} style={{ width: "100px" }}>Hạn sử dụng</th>
                </tr>
              </thead>
              <tbody>
                {/* [THAY THẾ] Sử dụng currentData từ hook */}
                {currentData.length > 0 ? (
                  currentData.map((item, index) => {
                    const isSoldOut = item.SoLuongConLai === 0;
                    const isExpiringSoon =
                      new Date(item.HanSuDung).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000;

                    return (
                      <tr key={`${item.MaPhieuNhap}-${item.TenThuoc}-${index}`}>
                        <td style={{ textAlign: "center" }}>{item.MaPhieuNhap}</td>
                        <td>{formatDate(item.NgayNhap)}</td>
                        <td style={{ fontWeight: "500" }}>{item.TenThuoc}</td>
                        <td>{item.TenNhaCungCap}</td>
                        <td className={styles.numberCell} style={{ textAlign: "center" }}>{item.SoLuongNhap}</td>
                        <td className={styles.numberCell} style={{ textAlign: "center", fontWeight: "bold" }}>
                          {item.SoLuongConLai}
                        </td>
                        <td style={{ textAlign: "center" }}>{renderStatus(item.SoLuongConLai)}</td>
                        <td className={styles.numberCell}>{formatCurrency(item.DonGiaNhap)}</td>
                        <td
                          style={{
                            color: !isSoldOut && isExpiringSoon ? "#e74c3c" : "inherit",
                            fontWeight: !isSoldOut && isExpiringSoon ? "bold" : "normal",
                          }}
                        >
                          {formatDate(item.HanSuDung)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "20px" }}>
                      Chưa có dữ liệu nhập kho.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* [THAY THẾ] Chỉ cần thả component này vào là xong */}
          <PaginationComponent />
        </>
      )}

      <ModalWithAnimation
        title="Tạo Phiếu Nhập Mới"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customClass={modalStyles.modalLarge}
        width="800px"
      >
        <PhieuNhapForm onClose={() => setIsModalOpen(false)} onSave={handleSaveSuccess} />
      </ModalWithAnimation>
    </div>
  );
};