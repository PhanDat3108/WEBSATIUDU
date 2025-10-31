import React, { useState, useEffect } from 'react';
import { Medicine } from '../../interfaces'; // Import type
import styles from '../../styles/Form.module.css';

// Loại bỏ 'id' và 'stt' khỏi kiểu dữ liệu của Form
type MedicineFormData = Omit<Medicine, 'id' | 'stt'>;

interface MedicineFormProps {
  initialData?: Medicine | null; // Dữ liệu ban đầu (nếu là 'Sửa')
  onSubmit: (data: MedicineFormData) => void; // Hàm xử lý khi submit
  onCancel: () => void; // Hàm xử lý khi bấm 'Hủy'
}

// Trạng thái form rỗng
const defaultFormState: MedicineFormData = {
  maThuoc: '',
  tenThuoc: '',
  loaiThuoc: '',
  soLuong: 0,
  hsd: '',
  nhaCungCap: '',
  ngayNhap: '',
};

const MedicineForm: React.FC<MedicineFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<MedicineFormData>(defaultFormState);

  // Khi `initialData` thay đổi (khi bấm nút 'Sửa')
  // Cập nhật state của form
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormState); // Reset về rỗng nếu là 'Thêm'
    }
  }, [initialData]);

  // Xử lý khi gõ vào input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'soLuong' ? parseInt(value, 10) : value,
    }));
  };

  // Xử lý khi bấm nút Submit (Thêm/Cập nhật)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      
      {/* Mã thuốc */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Mã thuốc</label>
        <input
          type="text" name="maThuoc"
          value={formData.maThuoc}
          onChange={handleChange}
          className={styles.formInput} required
        />
      </div>

      {/* Tên thuốc */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Tên thuốc</label>
        <input
          type="text" name="tenThuoc"
          value={formData.tenThuoc}
          onChange={handleChange}
          className={styles.formInput} required
        />
      </div>

      {/* Loại thuốc */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Loại thuốc</label>
        <input
          type="text" name="loaiThuoc"
          value={formData.loaiThuoc}
          onChange={handleChange}
          className={styles.formInput}
        />
      </div>

      {/* Số lượng */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Số lượng</label>
        <input
          type="number" name="soLuong"
          value={formData.soLuong}
          onChange={handleChange}
          className={styles.formInput} min="0" required
        />
      </div>

      {/* Hạn sử dụng (Dùng input type="date") */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Hạn sử dụng</label>
        <input
          type="date" name="hsd"
          value={formData.hsd}
          onChange={handleChange}
          className={styles.formInput} required
        />
      </div>

      {/* Nhà cung cấp */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Nhà cung cấp</label>
        <input
          type="text" name="nhaCungCap"
          value={formData.nhaCungCap}
          onChange={handleChange}
          className={styles.formInput}
        />
      </div>

      {/* Ngày nhập */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Ngày nhập</label>
        <input
          type="date" name="ngayNhap"
          value={formData.ngayNhap}
          onChange={handleChange}
          className={styles.formInput} required
        />
      </div>

      {/* Buttons */}
      <div className={styles.buttonContainer}>
        <button type="button" className={`${styles.formButton} ${styles.cancelButton}`} onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className={`${styles.formButton} ${styles.submitButton}`}>
          {initialData ? 'Cập nhật' : 'Thêm'}
        </button>
      </div>
    </form>
  );
};

export default MedicineForm;