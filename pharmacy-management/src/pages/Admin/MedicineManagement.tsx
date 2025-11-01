// src/pages/Admin/MedicineManagement.tsx
import React, { useState, useEffect } from 'react';
import { Thuoc } from '../../interfaces';
import { getMedicines, deleteMedicine } from '../../api/thuocApi';
import { MedicineForm } from '../../components/AdminForms/MedicineForm';
import Modal from '../../components/common/Modal';
import styles from '../../styles/AdminManagement.module.css';

const MedicineManagement: React.FC = () => {
  const [medicines, setMedicines] = useState<Thuoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Thuoc | null>(null);

  // ... (Tất cả các hàm logic: loadMedicines, handleOpenModal... giữ nguyên) ...
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

  const handleDelete = async (maThuoc: string) => {
    if (window.confirm('Bạn có chắc muốn xóa thuốc này?')) {
      try {
        await deleteMedicine(maThuoc);
        alert('Đã xóa thành công!');
        loadMedicines();
      } catch (err) {
        alert('Lỗi khi xóa: ' + (err as Error).message);
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <tr><td colSpan={7} className={styles.tableCell}>Đang tải dữ liệu, vui lòng chờ...</td></tr>;
    }
    if (error) {
      return <tr><td colSpan={7} className={styles.tableCell} style={{ color: 'red' }}>Lỗi: {error}</td></tr>;
    }
    if (medicines.length === 0) {
      return <tr><td colSpan={7} className={styles.tableCell}>Không tìm thấy dữ liệu thuốc.</td></tr>;
    }

    return medicines.map((med, index) => (
      <tr 
        key={med.MaThuoc} 
        className={`${styles.tableRow} ${index % 2 === 1 ? styles.tableRowEven : ''}`}
      >
        <td className={styles.tableCell}>{med.MaThuoc}</td>
        <td className={styles.tableCell}>{med.TenThuoc}</td>
        <td className={styles.tableCell}>{med.SoLuongTon}</td>
        <td className={styles.tableCell}>{med.DonViTinh}</td>
        <td className={styles.tableCell}>{new Date(med.HanSuDung).toLocaleDateString()}</td>
        <td className={styles.tableCell}>{med.GiaBan}</td>
        <td className={styles.actionCell}> 
          <button onClick={() => handleOpenModal(med)} className={styles.editButton}>Sửa</button>
          <button onClick={() => handleDelete(med.MaThuoc)} className={styles.deleteButton}>Xóa</button>
        </td>
      </tr>
    ));
  };


  return (
    <>
      {/* THAY ĐỔI HIỆU ỨNG Ở ĐÂY */}
      <div className={styles.container}>
        <h1 className={styles.title}>Quản lý Thuốc</h1>
        <button onClick={() => handleOpenModal(null)} className={styles.addButton}>
          Thêm thuốc mới
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Mã Thuốc</th>
              <th className={styles.tableHeader}>Tên Thuốc</th>
              <th className={styles.tableHeader}>Số lượng tồn</th>
              <th className={styles.tableHeader}>Đơn vị</th>
              <th className={styles.tableHeader}>Hạn sử dụng</th>
              <th className={styles.tableHeader}>Giá bán</th>
              <th className={styles.tableHeader}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {renderContent()}
          </tbody>
        </table>
      </div>

      {/* Modal giữ nguyên, không bị ảnh hưởng */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedMedicine ? 'Sửa thông tin thuốc' : 'Thêm thuốc mới'}
      >
        <MedicineForm
          medicine={selectedMedicine}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default MedicineManagement;