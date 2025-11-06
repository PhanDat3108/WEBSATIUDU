// src/pages/Admin/NhanVienManagement.tsx
import React, { useState, useEffect } from 'react';
import { NhanVien } from '../../interfaces';
import { getNhanVien, deleteNhanVien } from '../../api/nhanVienApi';
import { NhanVienForm } from '../../components/AdminForms/NhanVienForm';
import Modal from '../../components/common/Modal';
import styles from '../../styles/AdminManagement.module.css';

const NhanVienManagement: React.FC = () => {
  const [employees, setEmployees] = useState<NhanVien[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<NhanVien | null>(null);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getNhanVien();
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
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleFormSubmitSuccess = () => {
    handleCloseModal();
    loadEmployees(); // Tải lại danh sách sau khi Sửa
  };

  const handleDelete = async (maNV: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa nhân viên ${maNV}?`)) {
      try {
        await deleteNhanVien(maNV);
        alert('Xóa thành công!');
        loadEmployees(); // Tải lại danh sách
      } catch (err) {
        setError((err as Error).message);
        alert('Xóa thất bại: ' + (err as Error).message);
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <tr><td colSpan={5}>Đang tải dữ liệu nhân viên...</td></tr>;
    }
    if (error) {
      return <tr><td colSpan={5}>Lỗi: {error}</td></tr>;
    }
    if (employees.length === 0) {
      return <tr><td colSpan={5}>Không có dữ liệu nhân viên. (Đang chờ BE)</td></tr>;
    }

    // Dữ liệu sẽ được render ở đây khi BE có
    return employees.map((nv) => (
      <tr key={nv.MaNhanVien}>
        <td>{nv.MaNhanVien}</td>
        <td>{nv.TenNhanVien}</td>
        <td>{nv.TaiKhoan}</td>
        <td>{nv.VaiTro}</td>
        <td>
          <button onClick={() => handleOpenModal(nv)} className={styles.editButton}>Sửa</button>
          <button onClick={() => handleDelete(nv.MaNhanVien)} className={styles.deleteButton}>Xóa</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản lý Nhân viên</h1>
      
      {/* Nút Thêm Mới - Tạm thời vô hiệu hóa chờ BE */}
      {/* <button onClick={() => handleOpenModal(null)} className={styles.addButton}>
        + Thêm nhân viên
      </button> 
      */}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã NV</th>
            <th>Tên Nhân Viên</th>
            <th>Tài khoản</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {renderContent()}
        </tbody>
      </table>

      {/* Modal chỉ hoạt động cho chức năng Sửa */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Sửa thông tin nhân viên"
      >
        {selectedEmployee && (
          <NhanVienForm
            initialData={selectedEmployee}
            onFormSubmitSuccess={handleFormSubmitSuccess}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default NhanVienManagement;