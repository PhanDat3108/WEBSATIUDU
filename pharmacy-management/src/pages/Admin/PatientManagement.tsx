// src/pages/Admin/PatientManagement.tsx
import React, { useState, useEffect } from "react";
import { BenhNhan } from "../../interfaces";
import { getPatients, deletePatient } from "../../api/benhNhanApi";
import { PatientForm } from "../../components/AdminForms/PatientForm";
import Modal from "../../components/common/Modal";
import styles from "../../styles/AdminManagement.module.css";

// [Note] Import cái hook phân trang mình tự viết vào
import { usePagination } from "../../components/common/usePagination";

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<BenhNhan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<BenhNhan | null>(null);

  // [Note] Khúc này gọi hook phân trang ra dùng nè.
  // - currentData: là danh sách bệnh nhân của trang hiện tại (đã bị cắt ngắn).
  // - PaginationComponent: là cái thanh nút bấm 1, 2, 3...
  // Tôi để 5 người/trang cho dễ nhìn, muốn nhiều hơn thì sửa số 5.
  const { currentData, PaginationComponent } = usePagination(patients, 7);

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

 

  const renderContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={7} className={styles.loadingCell}>
            Đang tải...
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan={7} className={styles.errorCell}>
            {error}
          </td>
        </tr>
      );
    }
    if (patients.length === 0) {
      return (
        <tr>
          <td colSpan={7} className={styles.emptyCell}>
            Không có dữ liệu bệnh nhân.
          </td>
        </tr>
      );
    }

    // [Note] Chỗ này quan trọng: Thay vì map biến "patients" (list tổng),
    // mình map biến "currentData" để nó chỉ hiện ra 5 người của trang hiện tại thôi.
    return currentData.map((item) => (
      <tr key={item.MaBenhNhan}>
        <td style={{ textAlign: "center" }}>{item.MaBenhNhan}</td>
        <td>{item.TenBenhNhan}</td>
        <td style={{ textAlign: "center" }}>
          {new Date(item.NgaySinh).toLocaleDateString("vi-VN")}
        </td>
        <td style={{ textAlign: "center" }}>{item.GioiTinh}</td>
        <td style={{ textAlign: "center" }}>{item.SoDienThoai}</td>
        <td>{item.DiaChi}</td>
        <td className={styles.actionButtons}>
          <button onClick={() => handleOpenModal(item)} className={styles.editButton}>
            Sửa
          </button>
          
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Quản lý Bệnh nhân</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader} style={{ width: 60 }}>Mã</th>
              <th className={styles.tableHeader} style={{ width: 150 }}>
                Họ tên
              </th>
              <th className={styles.tableHeader} style={{ width: 100 }}>Ngày sinh</th>
              <th className={styles.tableHeader} style={{ width: 80 }}>Giới tính</th>
              <th className={styles.tableHeader} style={{ width: 100 }}>Điện thoại</th>
              <th className={styles.tableHeader} style={{ width: 300 }}>
                Địa chỉ
              </th>
              <th className={styles.tableHeader} style={{ width: 100 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>{renderContent()}</tbody>
        </table>

        {/* [Note] Đặt thanh chuyển trang ở dưới bảng, căn giữa cho đẹp */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
           <PaginationComponent />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedPatient ? "Sửa thông tin bệnh nhân" : ""}
        width="600px"
      >
        <PatientForm patient={selectedPatient} onSave={handleSave} onClose={handleCloseModal} />
      </Modal>
    </>
  );
};

export default PatientManagement;
