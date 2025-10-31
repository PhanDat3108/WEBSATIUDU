import React, { useState } from 'react';
import styles from '../../styles/AdminManagement.module.css'; // Dùng chung CSS Bảng
import Modal from '../../components/common/Modal'; // Dùng chung Modal
import PatientForm from '../../components/AdminForms/PatientForm'; // Dùng Form Bệnh nhân
import { Patient } from '../../interfaces'; // Import type

// Dữ liệu giả lập
const mockPatientsData: Patient[] = [
    { id: 1, stt: 1, maBenhNhan: 'BN001', tenBenhNhan: 'Nguyễn Văn A', gioiTinh: 'Nam', tuoi: 30, diaChi: '123 Đường ABC, Q.1, TP.HCM', sdt: '0909123456', tienSuBenhAn: 'Tiểu đường type 2' },
    { id: 2, stt: 2, maBenhNhan: 'BN002', tenBenhNhan: 'Trần Thị B', gioiTinh: 'Nữ', tuoi: 45, diaChi: '456 Đường XYZ, Hà Nội', sdt: '0987654321', tienSuBenhAn: 'Cao huyết áp' },
    { id: 3, stt: 3, maBenhNhan: 'BN003', tenBenhNhan: 'Lê Văn C', gioiTinh: 'Nam', tuoi: 22, diaChi: '789 Đường LMN, Đà Nẵng', sdt: '0123456789', tienSuBenhAn: 'Viêm xoang' },
];

// Dữ liệu Form
type PatientFormData = Omit<Patient, 'id' | 'stt'>;

const PatientManagement: React.FC = () => {
    const [patients, setPatients] = useState(mockPatientsData);
    
    // State quản lý Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // Mở Modal chế độ "Thêm"
    const handleAdd = () => {
        setModalMode('add');
        setSelectedPatient(null);
        setIsModalOpen(true);
    };

    // Mở Modal chế độ "Sửa"
    const handleEdit = (id: number) => {
        const patientToEdit = patients.find(p => p.id === id);
        if (patientToEdit) {
            setModalMode('edit');
            setSelectedPatient(patientToEdit);
            setIsModalOpen(true);
        }
    };

    // Xử lý Xóa
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

    // Xử lý Submit Form (Cả Thêm và Sửa)
    const handleFormSubmit = (data: PatientFormData) => {
        if (modalMode === 'add') {
            const newId = Math.max(...patients.map(p => p.id)) + 1;
            const newPatient: Patient = {
                ...data,
                id: newId,
                stt: newId,
            };
            setPatients(prev => [newPatient, ...prev]);
            alert('Đã thêm bệnh nhân mới!');
            
        } else if (modalMode === 'edit' && selectedPatient) {
            setPatients(prev => prev.map(p => 
                p.id === selectedPatient.id ? { ...p, ...data } : p
            ));
            alert(`Đã cập nhật bệnh nhân ID: ${selectedPatient.id}`);
        }
        
        handleCloseModal();
    };

    return (
        <div className={styles.managementContainer}>
            {/* Header: Title và Nút Thêm */}
            <div className={styles.header}>
                <h2 className={styles.title}>Quản lý bệnh nhân</h2>
                <button className={styles.addButton} onClick={handleAdd}>
                    + Thêm bệnh nhân
                </button>
            </div>

            {/* Bảng Grid - Tùy chỉnh cột */}
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
                        <div className={styles.gridCell}>{bn.stt}</div>
                        <div className={styles.gridCell}>{bn.maBenhNhan}</div>
                        <div className={styles.gridCell}>{bn.tenBenhNhan}</div>
                        <div className={styles.gridCell}>{bn.gioiTinh}</div>
                        <div className={styles.gridCell}>{bn.tuoi}</div>
                        <div className={styles.gridCell}>{bn.diaChi}</div>
                        <div className={styles.gridCell}>{bn.sdt}</div>
                        
                        {/* Cột Thao tác (Sửa, Xóa) */}
                        <div className={styles.actionCell}>
                            <button 
                                className={`${styles.actionButton} ${styles.editButton}`} 
                                onClick={() => handleEdit(bn.id)}
                            >
                                Sửa
                            </button>
                            <button 
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                onClick={() => handleDelete(bn.id)}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL THÊM/SỬA BỆNH NHÂN --- */}
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