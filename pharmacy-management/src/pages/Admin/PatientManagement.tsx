import React, { useState } from 'react';
import styles from '../../styles/AdminManagement.module.css'; 
import Modal from '../../components/common/Modal'; 
import PatientForm from '../../components/AdminForms/PatientForm'; 
import { Patient } from '../../interfaces'; 
import { mockPatients } from '../../api/mockDatabase';

type PatientFormData = Omit<Patient, 'id' | 'stt'>;

const PatientManagement: React.FC = () => {
    const [patients, setPatients] = useState(mockPatients);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // ... (Toàn bộ các hàm handleAdd, handleEdit, handleDelete, handleFormSubmit giữ nguyên) ...
    const handleAdd = () => {
        setModalMode('add');
        setSelectedPatient(null);
        setIsModalOpen(true);
    };
    const handleEdit = (id: number) => {
        const patientToEdit = patients.find(p => p.id === id);
        if (patientToEdit) {
            setModalMode('edit');
            setSelectedPatient(patientToEdit);
            setIsModalOpen(true);
        }
    };
    const handleDelete = (id: number) => {
        if (window.confirm(`Bạn có chắc muốn Xóa Bệnh nhân ID: ${id}?`)) {
            setPatients(prev => prev.filter(p => p.id !== id));
            alert('Đã xóa!');
        }
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPatient(null);
    };
    const handleFormSubmit = (data: PatientFormData) => {
        if (modalMode === 'add') {
            const newId = Math.max(...patients.map(p => p.id)) + 1;
            const newPatient: Patient = { ...data, id: newId, stt: newId };
            setPatients(prev => [newPatient, ...prev]);
            alert('Đã thêm bệnh nhân mới!');
        } else if (modalMode === 'edit' && selectedPatient) {
            setPatients(prev => prev.map(p => 
                p.id === selectedPatient.id ? { ...p, ...data, id: p.id, stt: p.stt } : p
            ));
            alert(`Đã cập nhật bệnh nhân ID: ${selectedPatient.id}`);
        }
        handleCloseModal();
    };

    return (
        // [ĐÃ SỬA] Thêm 1 div bọc ngoài
        <div>
            {/* Div nội dung (Bảng) sẽ có animation */}
            <div className={`${styles.managementContainer} animate__animated animate__fadeInRightBig animate__faster`}>
                {/* Header: Title và Nút Thêm */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Quản lý bệnh nhân</h2>
                    <button className={styles.addButton} onClick={handleAdd}>
                        + Thêm bệnh nhân
                    </button>
                </div>

                {/* Bảng Grid */}
                <div 
                    className={styles.gridTable} 
                    style={{ gridTemplateColumns: '50px 100px 1.5fr 80px 60px 2fr 1fr 1fr' }}
                >
                    {/* Hàng Header */}
                    <div className={styles.gridHeader}>
                        <div>STT</div>
                        <div>Mã BN</div>
                        <div>Tên Bệnh nhân</div>
                        <div>Giới tính</div>
                        <div>Tuổi</div>
                        <div>Địa chỉ</div>
                        <div>Điện thoại</div>
                        <div>Thao tác</div>
                    </div>

                    {/* Hàng Dữ liệu */}
                    {patients.map((bn) => (
                        <div className={styles.gridRow} key={bn.id}>
                            {/* ... (các gridCell) ... */}
                            <div className={styles.gridCell}>{bn.stt}</div>
                            <div className={styles.gridCell}>{bn.maBenhNhan}</div>
                            <div className={styles.gridCell}>{bn.tenBenhNhan}</div>
                            <div className={styles.gridCell}>{bn.gioiTinh}</div>
                            <div className={styles.gridCell}>{bn.tuoi}</div>
                            <div className={styles.gridCell}>{bn.diaChi}</div>
                            <div className={styles.gridCell}>{bn.sdt}</div>
                            <div className={styles.actionCell}>
                                <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => handleEdit(bn.id)}>
                                    Sửa
                                </button>
                                <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(bn.id)}>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal được để BÊN NGOÀI div animation */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalMode === 'add' ? 'Thêm mới bệnh nhân' : 'Chỉnh sửa bệnh nhân'}
            >
                <PatientForm
                    initialData={selectedPatient}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default PatientManagement;