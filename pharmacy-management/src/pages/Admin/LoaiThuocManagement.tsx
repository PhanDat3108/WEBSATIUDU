// src/pages/Admin/LoaiThuocManagement.tsx
import React, { useState, useEffect } from 'react';
import { LoaiThuoc } from '../../interfaces';
// [SỬA] Import thêm hàm add, update, delete
import { getLoaiThuoc, deleteLoaiThuoc } from '../../api/loaiThuocApi';
import Modal from '../../components/common/Modal';
import styles from '../../styles/AdminManagement.module.css';
// [MỚI] Import Form
import { LoaiThuocForm } from '../../components/AdminForms/LoaiThuocForm';

const LoaiThuocManagement: React.FC = () => {
  const [categories, setCategories] = useState<LoaiThuoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LoaiThuoc | null>(null);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null); // [SỬA] Xóa lỗi cũ
      
      // [SỬA] Gọi API thật
      const data = await getLoaiThuoc(); 
      setCategories(data);
      
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
    loadCategories(); // Tải lại danh sách
  };

  // [MỚI] Hàm Xóa
  const handleDelete = async (maLoai: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại thuốc này?')) {
      try {
        await deleteLoaiThuoc(maLoai);
        loadCategories();
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <tr><td colSpan={3} className={styles.loadingCell}>Đang tải...</td></tr>;
    }
    if (error) {
      return <tr><td colSpan={3} className={styles.errorCell}>{error}</td></tr>;
    }
     if (categories.length === 0) { // [SỬA] Bỏ điều kiện !error
        return <tr><td colSpan={3} className={styles.emptyCell}>Không có dữ liệu loại thuốc.</td></tr>;
    }

    return categories.map((item) => (
      <tr key={item.MaLoai}>
        <td>{item.MaLoai}</td>
        <td>{item.TenLoai}</td>
        <td className={styles.actionButtons}>
          <button onClick={() => handleOpenModal(item)} className={styles.editButton}>Sửa</button>
          {/* [MỚI] Thêm sự kiện Xóa */}
          <button onClick={() => handleDelete(item.MaLoai)} className={styles.deleteButton}>Xóa</button>
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

      {/* [SỬA] Thay thế div bằng Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCategory ? 'Sửa Loại Thuốc' : 'Thêm Loại Thuốc'}
      >
        <LoaiThuocForm
          loaiThuoc={selectedCategory}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default LoaiThuocManagement;