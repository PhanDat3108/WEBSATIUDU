// src/pages/Admin/XuatNoiBoManagement.tsx
import React, { useState, useEffect } from "react";
import { phieuXuatApi } from "../../api/phieuXuatApi"; 
import { XuatNoiBoHistory } from "../../interfaces";
import styles from "../../styles/AdminManagement.module.css";

// Imports cho Modal và Form
import ModalWithAnimation from "../../components/common/ModalWithAnimation";
import { XuatNoiBoForm } from "../../components/AdminForms/XuatNoiBoForm";
import modalStyles from "../../styles/Modal.module.css";

// [MỚI] Import Hook phân trang (đường dẫn theo file mẫu bạn cung cấp)
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

export const XuatNoiBoManagement = () => {
  const [history, setHistory] = useState<XuatNoiBoHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // [MỚI] Sử dụng Hook phân trang
  // - history: dữ liệu gốc
  // - 7: số dòng mỗi trang
  const { currentData, PaginationComponent } = usePagination(history, 7);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await phieuXuatApi.getAllDetails();
      // Sắp xếp mới nhất lên đầu (tùy chọn)
      const sortedData = data.sort((a: any, b: any) => 
        new Date(b.NgayXuat).getTime() - new Date(a.NgayXuat).getTime()
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

  return (
    // [STYLE MỚI] Thêm flex column và minHeight để hỗ trợ sticky footer
    <div 
      className={styles.adminManagementPage} 
      style={{ display: "flex", flexDirection: "column", minHeight: "85vh" }}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>Quản lý xuất kho (Toàn bộ)</h1>
        <button onClick={handleAddClick} className={styles.addButton}>
          + Xuất nội bộ / hủy
        </button>
      </header>

      {isLoading && <div className={styles.loading}>Đang tải dữ liệu...</div>}
      {error && <div className={styles.error}>Lỗi: {error}</div>}

      {!isLoading && !error && (
        <>
          {/* [STYLE MỚI] flex: 1 để bảng chiếm khoảng trống còn lại */}
          <div className={styles.tableContainer} style={{ flex: 1 }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader} style={{ width: "100px" }}>Mã</th>
                  <th className={styles.tableHeader} style={{ width: "100px" }}>Ngày xuất</th>
                  <th className={styles.tableHeader} style={{ width: "80px" }}>Loại xuất</th>
                  <th className={styles.tableHeader}>Tên thuốc</th>
                  <th className={styles.tableHeader} style={{ width: "150px" }}>Nhân viên</th>
                  <th className={styles.tableHeader} style={{ width: "80px" }}>Số lượng</th>
                  <th className={styles.tableHeader} style={{ width: "100px" }}>Đơn giá</th>
                  <th className={styles.tableHeader} style={{ width: "80px" }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {/* [MỚI] Map qua currentData thay vì history */}
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={`${item.MaPhieuXuat}-${index}`}>
                      <td style={{ textAlign: "center" }}>{item.MaPhieuXuat}</td>
                      <td>{formatDate(item.NgayXuat)}</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            backgroundColor:
                              item.LoaiXuat === "Bán" ? "#e6f7ff" : item.LoaiXuat === "Bỏ" ? "#fff1f0" : "#f6ffed",
                            color: item.LoaiXuat === "Bán" ? "#1890ff" : item.LoaiXuat === "Bỏ" ? "#cf1322" : "#389e0d",
                          }}
                        >
                          {item.LoaiXuat}
                        </span>
                      </td>
                      <td>{item.TenThuoc}</td>
                      <td>{item.TenNhanVien}</td>
                      <td className={styles.numberCell} style={{ textAlign: "center" }}>
                        {item.SoLuongXuat}
                      </td>
                      <td className={styles.numberCell}>{formatCurrency(item.DonGiaXuat)}</td>
                      <td className={styles.numberCell}>{formatCurrency(item.SoLuongXuat * item.DonGiaXuat)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      Chưa có dữ liệu xuất kho.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* [MỚI] Component Phân trang tự động hiển thị ở cuối */}
          <PaginationComponent />
        </>
      )}

      <ModalWithAnimation
        title="Tạo Phiếu Xuất Kho Nội Bộ"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customClass={modalStyles.modalLarge}
      >
        <XuatNoiBoForm onClose={() => setIsModalOpen(false)} onSave={handleSaveSuccess} />
      </ModalWithAnimation>
    </div>
  );
};
