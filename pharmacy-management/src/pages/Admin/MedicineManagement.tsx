
// src/pages/Admin/MedicineManagement.tsx
import React, { useState, useEffect } from "react";
import { Thuoc } from "../../interfaces";
import { getMedicines } from "../../api/thuocApi";
import { MedicineForm } from "../../components/AdminForms/MedicineForm";
import Modal from "../../components/common/Modal";
import styles from "../../styles/AdminManagement.module.css";
import { usePagination } from "../../components/common/usePagination";
// khai báo usestate cần thiết 
const MedicineManagement: React.FC = () => {
  const [medicines, setMedicines] = useState<Thuoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Thuoc | null>(null);
  const { currentData, PaginationComponent } = usePagination(medicines);
// Hàm tải trang 
  const loadMedicines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMedicines();
      setMedicines(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleOpenModal = (medicine: Thuoc | null) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleSave = () => {
    handleCloseModal();
    loadMedicines();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={8} className={styles.loadingCell}>
            Đang tải...
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan={8} className={styles.errorCell}>
            {error}
          </td>
        </tr>
      );
    }
    if (medicines.length === 0) {
      return (
        <tr>
          <td colSpan={8} className={styles.emptyCell}>
            Không có dữ liệu thuốc.
          </td>
        </tr>
      );
    }

    // Thay vì map cái "medicines" (list dài nhằng nhẵng), mình map cái "currentData" (list nhỏ gọn) thôi.
    return currentData.map((med) => (
      <tr key={med.MaThuoc}>
        <td style={{ textAlign: "center" }}>{med.MaThuoc}</td>
        <td>{med.TenThuoc}</td>
        <td>{med.TenLoai || "N/A"}</td>
        <td>{med.TenNhaCungCap || "N/A"}</td>
        <td style={{ textAlign: "center" }}>{med.SoLuongTon}</td>
        <td style={{ textAlign: "center" }}>{med.DonViTinh}</td>
        <td style={{ textAlign: "center" }}>{med.GiaBan.toLocaleString("vi-VN")} VNĐ</td>
        <td className={styles.actionButtons}>
          <button onClick={() => handleOpenModal(med)} className={styles.editButton}>
            Sửa
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Quản lý danh sách thuốc</h1>
        <button onClick={() => handleOpenModal(null)} className={styles.addButton}>
          Thêm thuốc mới
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader} style={{ width: 60 }}>
                Mã thuốc
              </th>
              <th className={styles.tableHeader} style={{ width: 150 }}>
                Tên thuốc
              </th>
              <th className={styles.tableHeader} style={{ width: 120 }}>
                Tên loại
              </th>
              <th className={styles.tableHeader} style={{ width: 200 }}>
                Nhà cung cấp
              </th>
              <th className={styles.tableHeader} style={{ width: 60 }}>
                Số lượng tồn
              </th>
              <th className={styles.tableHeader} style={{ width: 40 }}>
                Đơn vị
              </th>
              <th className={styles.tableHeader} style={{ width: 100 }}>
                Giá bán
              </th>
              <th className={styles.tableHeader} style={{ width: 20 }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>{renderContent()}</tbody>
        </table>

        
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "end" }}>
        
          <PaginationComponent />
        </div>
      </div>
{/* truyền prop xuống con  để call back  */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedMedicine ? "Sửa thông tin thuốc" : "Thêm thuốc mới"}
        width="600px"
      >
        <MedicineForm medicine={selectedMedicine} onSave={handleSave} onClose={handleCloseModal} />
      </Modal>
    </>
  );
};

export default MedicineManagement;
