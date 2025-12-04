// src/pages/Admin/LoaiThuocManagement.tsx
import React, { useState, useEffect } from "react";
import { LoaiThuoc } from "../../interfaces";
import { getLoaiThuoc, deleteLoaiThuoc } from "../../api/loaiThuocApi";
import Modal from "../../components/common/Modal";
import styles from "../../styles/AdminManagement.module.css";
import { LoaiThuocForm } from "../../components/AdminForms/LoaiThuocForm";

//  Kéo tool phân trang vào đây dùng luôn
import { usePagination } from "../../components/common/usePagination";

const LoaiThuocManagement: React.FC = () => {
  const [categories, setCategories] = useState<LoaiThuoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LoaiThuoc | null>(null);

  //  Cài đặt phân trang nè. 
  // "categories" là cục dữ liệu tổng
  const { currentData, PaginationComponent } = usePagination(categories, 7);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null); 
      const data = await getLoaiThuoc();
      setCategories(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
// kích hoạt load data khi ms vô trang
  useEffect(() => {
    loadCategories();
  }, []);
//Hàm logic nhận biết sửa hay xóa 
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

  const handleDelete = async (maLoai: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại thuốc này?")) {
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
      return (
        <tr>
          <td colSpan={3} className={styles.loadingCell}>
            Đang tải...
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan={3} className={styles.errorCell}>
            {error}
          </td>
        </tr>
      );
    }
    if (categories.length === 0) {
      return (
        <tr>
          <td colSpan={3} className={styles.emptyCell}>
            Không có dữ liệu loại thuốc.
          </td>
        </tr>
      );
    }

    // [Human Comment] Chỗ này sửa lại, lặp qua cái list đã cắt (currentData) 
    // chứ đừng lặp qua cái list tổng (categories) nữa nha.
    return currentData.map((item) => (
      <tr key={item.MaLoai}>
        <td style={{ textAlign: "center" }}>{item.MaLoai}</td>
        <td>{item.TenLoai}</td>
        <td className={styles.actionButtons}>
          <button onClick={() => handleOpenModal(item)} className={styles.editButton}>
            Sửa
          </button>
          <button onClick={() => handleDelete(item.MaLoai)} className={styles.deleteButton}>
            Xóa
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Quản lý loại thuốc</h1>
        <button onClick={() => handleOpenModal(null)} className={styles.addButton}>
          Thêm loại thuốc
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader} style={{ width: 80 }}>
                Mã
              </th>
              <th className={styles.tableHeader} style={{ width: 750 }}>
                Tên loại thuốc
              </th>
              <th className={styles.tableHeader} style={{ width: 100 }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>{renderContent()}</tbody>
        </table>

       
        <div /*style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}*/>
           <PaginationComponent />
        </div>
      </div>
{/* prop cho form  */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCategory ? "Sửa loại thuốc" : "Thêm loại thuốc"}
        width="500px"
      >
        <LoaiThuocForm loaiThuoc={selectedCategory} onSave={handleSave} onClose={handleCloseModal} />
      </Modal>
    </>
  );
};

export default LoaiThuocManagement;