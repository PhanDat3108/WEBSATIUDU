// src/pages/Admin/NhaCungCapManagement.tsx
import React, { useState, useEffect } from "react";
import { NhaCungCap } from "../../interfaces";
import { getNhaCungCap, deleteNhaCungCap } from "../../api/nhaCungCapApi";
import Modal from "../../components/common/Modal";
import styles from "../../styles/AdminManagement.module.css";
import { NhaCungCapForm } from "../../components/AdminForms/NhaCungCapForm";
import { usePagination } from "../../components/common/usePagination";

const NhaCungCapManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<NhaCungCap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<NhaCungCap | null>(null);


  const { currentData, PaginationComponent } = usePagination(suppliers, 7);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      setError(null); 
      const data = await getNhaCungCap();
      setSuppliers(data);
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

  const handleDelete = async (maNCC: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
      try {
        await deleteNhaCungCap(maNCC);
        loadSuppliers();
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={6} className={styles.loadingCell}>
            Đang tải...
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan={6} className={styles.errorCell}>
            {error}
          </td>
        </tr>
      );
    }
    if (suppliers.length === 0) {
      return (
        <tr>
          <td colSpan={6} className={styles.emptyCell}>
            Không có dữ liệu nhà cung cấp.
          </td>
        </tr>
      );
    }

    return currentData.map((item) => (
      <tr key={item.MaNhaCungCap}>
        <td style={{ textAlign: "center" }}>{item.MaNhaCungCap}</td>
        <td>{item.TenNhaCungCap}</td>
        <td>{item.DiaChi}</td>
        <td style={{ textAlign: "center" }}>{item.SoDienThoai}</td>
        <td>{item.Email}</td>
        <td className={styles.actionButtons}>
          <button onClick={() => handleOpenModal(item)} className={styles.editButton}>
            Sửa
          </button>
          <button onClick={() => handleDelete(item.MaNhaCungCap)} className={styles.deleteButton}>
            Xóa
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Quản lý nhà cung cấp</h1>
        <button onClick={() => handleOpenModal(null)} className={styles.addButton}>
          Thêm nhà cung cấp
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader} style={{ width: 60 }}>
                Mã
              </th>
              <th className={styles.tableHeader} style={{ width: 250 }}>
                Tên nhà cung cấp
              </th>
              <th className={styles.tableHeader} style={{ width: 300 }}>
                Địa chỉ
              </th>
              <th className={styles.tableHeader} style={{ width: 120 }}>
                Số điện thoại
              </th>
              <th className={styles.tableHeader} style={{ width: 200 }}>
                Email
              </th>
              <th className={styles.tableHeader} style={{ width: 100 }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>{renderContent()}</tbody>
        </table>

        <div >
           <PaginationComponent />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedSupplier ? "Sửa Nhà Cung Cấp" : "Thêm Nhà Cung Cấp"}
        width="600px"
      >
        <NhaCungCapForm supplier={selectedSupplier} onSave={handleSave} onClose={handleCloseModal} />
      </Modal>
    </>
  );
};

export default NhaCungCapManagement;
