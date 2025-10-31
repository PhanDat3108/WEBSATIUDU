import React, { useState } from 'react';
import styles from '../../styles/AdminManagement.module.css'; // Import CSS Bảng
import Modal from '../../components/common/Modal'; // Import Modal
import MedicineForm from '../../components/AdminForms/MedicineForm'; // Import Form
import { Medicine } from '../../interfaces'; // Import type

// Dữ liệu giả lập (Cập nhật thêm 2 trường mới)
const mockMedicinesData: Medicine[] = [
    { id: 1, stt: 1, maThuoc: 'PARA100', tenThuoc: 'Paracetamol 500mg', loaiThuoc: 'Giảm đau, hạ sốt', soLuong: 150, hsd: '2026-10-30', nhaCungCap: 'Traphaco', ngayNhap: '2024-10-30' },
    { id: 2, stt: 2, maThuoc: 'AMO500', tenThuoc: 'Amoxicillin 500mg', loaiThuoc: 'Kháng sinh', soLuong: 80, hsd: '2025-05-15', nhaCungCap: 'Hậu Giang', ngayNhap: '2024-05-15' },
    { id: 3, stt: 3, maThuoc: 'VITC100', tenThuoc: 'Vitamin C 100mg', loaiThuoc: 'Vitamin', soLuong: 300, hsd: '2027-01-20', nhaCungCap: 'Traphaco', ngayNhap: '2024-01-20' },
    { id: 4, stt: 4, maThuoc: 'BERG10', tenThuoc: 'Berberin 10mg', loaiThuoc: 'Tiêu hóa', soLuong: 50, hsd: '2025-12-01', nhaCungCap: 'Nam Hà', ngayNhap: '2024-12-01' },
    { id: 5, stt: 5, maThuoc: 'OPI05', tenThuoc: 'Omeprazol 20mg', loaiThuoc: 'Dạ dày', soLuong: 120, hsd: '2026-08-01', nhaCungCap: 'Hậu Giang', ngayNhap: '2024-08-01' },
];

// Định nghĩa kiểu dữ liệu cho Form (không cần id, stt)
type MedicineFormData = Omit<Medicine, 'id' | 'stt'>;

const MedicineManagement: React.FC = () => {
    const [medicines, setMedicines] = useState(mockMedicinesData);
    
    // State quản lý Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

    // Mở Modal chế độ "Thêm"
    const handleAdd = () => {
        setModalMode('add');
        setSelectedMedicine(null); // Không có dữ liệu ban đầu
        setIsModalOpen(true);
    };

    // Mở Modal chế độ "Sửa"
    const handleEdit = (id: number) => {
        const medicineToEdit = medicines.find(m => m.id === id);
        if (medicineToEdit) {
            setModalMode('edit');
            setSelectedMedicine(medicineToEdit); // Có dữ liệu ban đầu
            setIsModalOpen(true);
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm(`Bạn có chắc muốn Xóa Thuốc ID: ${id}?`)) {
            setMedicines(prev => prev.filter(m => m.id !== id));
            alert('Đã xóa!');
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMedicine(null);
    };

    // Xử lý Submit Form (Cả Thêm và Sửa)
    const handleFormSubmit = (data: MedicineFormData) => {
        if (modalMode === 'add') {
            // Logic Thêm (Tạo id, stt mới)
            const newId = Math.max(...medicines.map(m => m.id)) + 1;
            const newMedicine: Medicine = {
                ...data,
                id: newId,
                stt: newId,
            };
            setMedicines(prev => [newMedicine, ...prev]);
            alert('Đã thêm thuốc mới!');
            
        } else if (modalMode === 'edit' && selectedMedicine) {
            // Logic Sửa
            setMedicines(prev => prev.map(m => 
                m.id === selectedMedicine.id ? { ...m, ...data } : m
            ));
            alert(`Đã cập nhật thuốc ID: ${selectedMedicine.id}`);
        }
        
        handleCloseModal(); // Đóng Modal sau khi submit
    };

    return (
        <div className={styles.managementContainer}>
            {/* Header: Title và Nút Thêm */}
            <div className={styles.header}>
                <h2 className={styles.title}>Quản lý thuốc</h2>
                <button className={styles.addButton} onClick={handleAdd}>
                    + Thêm thuốc
                </button>
            </div>

            {/* Bảng Grid */}
            <div className={styles.gridTable}>
                {/* Hàng Header */}
                <div className={styles.gridHeader}>
                    <div>STT</div>
                    <div>Mã thuốc</div>
                    <div>Tên thuốc</div>
                    <div>Loại thuốc</div>
                    <div>Số lượng</div>
                    <div>Hạn sử dụng</div>
                    <div>Thao tác</div>
                </div>

                {/* Hàng Dữ liệu (Dùng state `medicines`) */}
                {medicines.map((thuoc) => (
                    <div className={styles.gridRow} key={thuoc.id}>
                        <div className={styles.gridCell}>{thuoc.stt}</div>
                        <div className={styles.gridCell}>{thuoc.maThuoc}</div>
                        <div className={styles.gridCell}>{thuoc.tenThuoc}</div>
                        <div className={styles.gridCell}>{thuoc.loaiThuoc}</div>
                        <div className={styles.gridCell}>{thuoc.soLuong}</div>
                        <div className={styles.gridCell}>{thuoc.hsd}</div>
                        
                        <div className={styles.actionCell}>
                            <button 
                                className={`${styles.actionButton} ${styles.editButton}`} 
                                onClick={() => handleEdit(thuoc.id)}
                            >
                                Sửa
                            </button>
                            <button 
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                onClick={() => handleDelete(thuoc.id)}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL THÊM/SỬA --- */}
            {/* Component Modal sẽ chỉ render khi isModalOpen=true */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalMode === 'add' ? 'Thêm mới thuốc' : 'Chỉnh sửa thuốc'}
            >
                <MedicineForm
                    initialData={selectedMedicine}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default MedicineManagement;