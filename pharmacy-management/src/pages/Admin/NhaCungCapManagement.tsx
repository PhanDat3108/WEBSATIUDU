// src/pages/Admin/NhaCungCapManagement.tsx
import React, { useState, useEffect } from 'react';
import { NhaCungCap } from '../../interfaces'; // Dựa theo database-sau-sửa.docx
import { getNhaCungCap } from '../../api/nhaCungCapApi'; // API file mới
import Modal from '../../components/common/Modal';
import styles from '../../styles/AdminManagement.module.css';
// (Bạn sẽ cần tạo file NhaCungCapForm sau, tạm thời dùng Modal trống)

const NhaCungCapManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<NhaCungCap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<NhaCungCap | null>(null);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      setError("Đang chờ API thật từ BE..."); // [TẠM THỜI]
      // const data = await getNhaCungCap(); // Sẽ mở dòng này khi BE sẵn sàng
      // setSuppliers(data);
      setSuppliers([]); // [TẠM THỜI]
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleOpenModal = (supplier: NhaCungCap | null) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleSave = () => {
    handleCloseModal();
    loadSuppliers();
  };

  const renderContent = () => {
    if (isLoading) {
      return <tr><td colSpan={6} className={styles.loadingCell}>Đang tải...</td></tr>;
    }
    if (error) {
      return <tr><td colSpan={6} className={styles.errorCell}>{error}</td></tr>;
    }
    if (suppliers.length === 0 && !error) {
        return <tr><td colSpan={6} className={styles.emptyCell}>Không có dữ liệu nhà cung cấp.</td></tr>;
    }

    return suppliers.map((item) => (
      <tr key={item.MaNhaCungCap}>
        <td>{item.MaNhaCungCap}</td>
        <td>{item.TenNhaCungCap}</td>
        <td>{item.DiaChi}</td>
        <td>{item.SoDienThoai}</td>
        <td>{item.Email}</td>
        <td className={styles.actionButtons}>
          <button onClick={() => handleOpenModal(item)} className={styles.editButton}>Sửa</button>
          <button className={styles.deleteButton}>Xóa</button>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Quản lý Nhà Cung Cấp</h1>
        <button onClick={() => handleOpenModal(null)} className={styles.addButton}>
          Thêm Nhà Cung Cấp
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              {/* Cột dựa theo database-sau-sửa.docx */}
              <th className={styles.tableHeader}>Mã NCC</th>
              <th className={styles.tableHeader}>Tên Nhà Cung Cấp</th>
              <th className={styles.tableHeader}>Địa chỉ</th>
              <th className={styles.tableHeader}>Số điện thoại</th>
              <th className={styles.tableHeader}>Email</th>
              <th className={styles.tableHeader}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {renderContent()}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedSupplier ? 'Sửa Nhà Cung Cấp' : 'Thêm Nhà Cung Cấp'}
      >
        <div>Form thêm/sửa Nhà Cung Cấp sẽ ở đây (Chờ tạo)</div>
      </Modal>
    </>
  );
};

export default NhaCungCapManagement;