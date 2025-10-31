import React, { useState } from 'react';
import styles from '../../styles/AdminManagement.module.css'; 
import Modal from '../../components/common/Modal'; 
import MedicineForm from '../../components/AdminForms/MedicineForm'; 
import { Medicine } from '../../interfaces'; 
import { mockMedicines } from '../../api/mockDatabase';

type MedicineFormData = Omit<Medicine, 'id' | 'stt'>;

const MedicineManagement: React.FC = () => {
    const [medicines, setMedicines] = useState(mockMedicines);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

    // ... (Toàn bộ các hàm handleAdd, handleEdit, handleDelete, handleFormSubmit giữ nguyên) ...
    const handleAdd = () => {
        setModalMode('add');
        setSelectedMedicine(null); 
        setIsModalOpen(true);
    };
    const handleEdit = (id: number) => {
        const medicineToEdit = medicines.find(m => m.id === id);
        if (medicineToEdit) {
            setModalMode('edit');
            setSelectedMedicine(medicineToEdit); 
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
    const handleFormSubmit = (data: MedicineFormData) => {
        if (modalMode === 'add') {
            const newId = Math.max(...medicines.map(m => m.id)) + 1;
            const newMedicine: Medicine = { ...data, id: newId, stt: newId };
            setMedicines(prev => [newMedicine, ...prev]);
            alert('Đã thêm thuốc mới!');
        } else if (modalMode === 'edit' && selectedMedicine) {
            setMedicines(prev => prev.map(m => 
                m.id === selectedMedicine.id ? { ...m, ...data, id: m.id, stt: m.stt } : m
            ));
            alert(`Đã cập nhật thuốc ID: ${selectedMedicine.id}`);
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

                    {/* Hàng Dữ liệu */}
                    {medicines.map((thuoc) => (
                        <div className={styles.gridRow} key={thuoc.id}>
                            {/* ... (các gridCell) ... */}
                            <div className={styles.gridCell}>{thuoc.stt}</div>
                            <div className={styles.gridCell}>{thuoc.maThuoc}</div>
                            <div className={styles.gridCell}>{thuoc.tenThuoc}</div>
                            <div className={styles.gridCell}>{thuoc.loaiThuoc}</div>
                            <div className={styles.gridCell}>{thuoc.soLuong}</div>
                            <div className={styles.gridCell}>{thuoc.hsd}</div>
                            <div className={styles.actionCell}>
                                <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => handleEdit(thuoc.id)}>
                                    Sửa
                                </button>
                                <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(thuoc.id)}>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal được để BÊN NGOÀI div animation
                -> Sửa lỗi z-index
            */}
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