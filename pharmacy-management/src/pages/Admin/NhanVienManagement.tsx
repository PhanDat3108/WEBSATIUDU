// src/pages/Admin/NhanVienManagement.tsx
import React, { useState, useEffect } from "react";
import { NhanVien } from "../../interfaces";
// [SỬA] Import các hàm đã kết nối
import { getNhanVien, deleteNhanVien } from "../../api/nhanVienApi";
import { NhanVienForm } from "../../components/AdminForms/NhanVienForm";
import Modal from "../../components/common/Modal";
import styles from "../../styles/AdminManagement.module.css";
import { usePagination } from "../../components/common/usePagination";

const NhanVienManagement: React.FC = () => {
  const [employees, setEmployees] = useState<NhanVien[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<NhanVien | null>(null);
  const { currentData, PaginationComponent } = usePagination(employees);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getNhanVien(); // Đã gọi API thật
      setEmployees(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleOpenModal = (employee: NhanVien | null) => {
    // Chỉ mở modal khi SỬA (employee không null)
    if (employee) {
      setSelectedEmployee(employee);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleFormSubmitSuccess = () => {
    handleCloseModal();
    loadEmployees(); // Tải lại danh sách sau khi Sửa
  };

  

  const renderContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={5}>Đang tải dữ liệu nhân viên...</td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan={5}>Lỗi: {error}</td>
        </tr>
      );
    }
    if (employees.length === 0) {
      return (
        <tr>
          <td colSpan={5}>Không có dữ liệu nhân viên.</td>
        </tr>
      );
    }

    return currentData.map((nv) => (
      <tr key={nv.MaNhanVien}>
        <td style={{ textAlign: "center" }}>{nv.MaNhanVien}</td>
        <td>{nv.TenNhanVien}</td>
        <td>{nv.TaiKhoan}</td>
        <td style={{ textAlign: "center" }}>{nv.VaiTro}</td>
        <td className={styles.actionButtons}>
          <button onClick={() => handleOpenModal(nv)} className={styles.editButton}>
            Sửa
          </button>
         
        </td>
      </tr>
    ));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản lý nhân viên</h1>

  

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader} style={{ width: "100px" }}>
              Mã
            </th>
            <th className={styles.tableHeader}>Họ tên</th>
            <th className={styles.tableHeader}>Tài khoản</th>
            <th className={styles.tableHeader}>Vai trò</th>
            <th className={styles.tableHeader} style={{ width: "120px" }}>
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>{renderContent()}</tbody>
      </table>

      {/* Modal chỉ hoạt động cho chức năng Sửa */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Sửa thông tin nhân viên">
        {selectedEmployee && (
          <NhanVienForm
            initialData={selectedEmployee}
            onFormSubmitSuccess={handleFormSubmitSuccess}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "end" }}>
        <PaginationComponent />
      </div>
    </div>
  );
};

export default NhanVienManagement;
