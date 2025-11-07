// src/pages/Admin/LoaiThuocManagement.tsx
import React, { useState, useEffect } from 'react';
import { LoaiThuoc } from '../../interfaces'; // Dựa theo database-sau-sửa.docx
import { getLoaiThuoc } from '../../api/loaiThuocApi'; // API file mới
import Modal from '../../components/common/Modal';
import styles from '../../styles/AdminManagement.module.css';
// (Bạn sẽ cần tạo file LoaiThuocForm sau, tạm thời dùng Modal trống)

const LoaiThuocManagement: React.FC = () => {
  const [categories, setCategories] = useState<LoaiThuoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LoaiThuoc | null>(null);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError("Đang chờ API thật từ BE..."); // [TẠM THỜI]
      // const data = await getLoaiThuoc(); // Sẽ mở dòng này khi BE sẵn sàng
      // setCategories(data);
      setCategories([]); // [TẠM THỜI]
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenModal = (category: LoaiThuoc | null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSave = () => {
    handleCloseModal();
    loadCategories();
  };

  const renderContent = () => {
    if (isLoading) {
      return <tr><td colSpan={3} className={styles.loadingCell}>Đang tải...</td></tr>;
    }
    if (error) {
      return <tr><td colSpan={3} className={styles.errorCell}>{error}</td></tr>;
    }
     if (categories.length === 0 && !error) {
        return <tr><td colSpan={3} className={styles.emptyCell}>Không có dữ liệu loại thuốc.</td></tr>;
    }

    return categories.map((item) => (
      <tr key={item.MaLoai}>
        <td>{item.MaLoai}</td>
        <td>{item.TenLoai}</td>
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
        <h1 className={styles.title}>Quản lý Loại Thuốc</h1>
        <button onClick={() => handleOpenModal(null)} className={styles.addButton}>
          Thêm Loại Thuốc
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              {/* Cột dựa theo database-sau-sửa.docx */}
              <th className={styles.tableHeader}>Mã Loại</th>
              <th className={styles.tableHeader}>Tên Loại</th>
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
        title={selectedCategory ? 'Sửa Loại Thuốc' : 'Thêm Loại Thuốc'}
      >
        <div>Form thêm/sửa Loại Thuốc sẽ ở đây (Chờ tạo)</div>
      </Modal>
    </>
  );
};

export default LoaiThuocManagement;