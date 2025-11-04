// src/pages/Admin/PatientManagement.tsx
import React, { useState, useEffect } from 'react';
import { BenhNhan } from '../../interfaces';
import { getPatients, deletePatient } from '../../api/benhNhanApi';
import { PatientForm } from '../../components/AdminForms/PatientForm';
import Modal from '../../components/common/Modal';
import styles from '../../styles/AdminManagement.module.css';

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<BenhNhan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<BenhNhan | null>(null);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleOpenModal = (patient: BenhNhan | null) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleSave = () => {
    handleCloseModal();
    loadPatients();
  };

  const handleDelete = async (maBenhNhan: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bệnh nhân này?')) {
      try {
        await deletePatient(maBenhNhan);
        alert('Đã xóa thành công!');
        loadPatients();
      } catch (err) {
        alert('Lỗi khi xóa: ' + (err as Error).message);
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <tr><td colSpan={7}>Đang tải dữ liệu, vui lòng chờ...</td></tr>;
    }
    if (error) {
      return <tr><td colSpan={7} style={{ color: 'red' }}>Lỗi: {error}</td></tr>;
    }
    if (patients.length === 0) {
      return <tr><td colSpan={7}>Không tìm thấy dữ liệu bệnh nhân.</td></tr>;
    }

    return patients.map((p) => (
      <tr key={p.MaBenhNhan}>
        <td>{p.MaBenhNhan}</td>
        <td>{p.TenBenhNhan}</td>
        <td>{new Date(p.NgaySinh).toLocaleDateString()}</td>
        <td>{p.GioiTinh}</td>
        <td>{p.SoDienThoai}</td>
        <td>{p.DiaChi}</td>
        <td>
          <button onClick={() => handleOpenModal(p)} className={styles.editButton}>Sửa</button>
          <button onClick={() => handleDelete(p.MaBenhNhan)} className={styles.deleteButton}>Xóa</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản lý Bệnh nhân</h1>
      <button onClick={() => handleOpenModal(null)} className={styles.addButton}>
        Thêm bệnh nhân mới
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã BN</th>
            <th>Tên Bệnh nhân</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {renderContent()}
        </tbody>
      </table>

      {/* SỬA LỖI Ở ĐÂY:
        Truyền 'isOpen' và 'title' vào component Modal
      */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedPatient ? 'Sửa thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}
      >
        <PatientForm
          patient={selectedPatient}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default PatientManagement;