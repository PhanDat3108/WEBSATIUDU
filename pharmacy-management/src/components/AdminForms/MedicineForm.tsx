import React, { useState, useEffect } from 'react';
import { Medicine } from '../../interfaces'; 
import styles from '../../styles/Form.module.css';

type MedicineFormData = Omit<Medicine, 'id' | 'stt'>;

interface MedicineFormProps {
  initialData?: Medicine | null; 
  onSubmit: (data: MedicineFormData) => void; 
  onCancel: () => void;
}

const defaultFormState: MedicineFormData = {
  maThuoc: '',
  tenThuoc: '',
  loaiThuoc: '',
  soLuong: 0,
  giaBan: 0, 
  hsd: '',
  nhaCungCap: '',
  ngayNhap: '',
};

const MedicineForm: React.FC<MedicineFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<MedicineFormData>(defaultFormState);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormState);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'soLuong' || name === 'giaBan') ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    // [BẮT BUỘC] Áp dụng layout Grid
    <form className={styles.form} onSubmit={handleSubmit}>
      
      {/* Mã thuốc */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Mã thuốc</label>
        <input type="text" name="maThuoc" value={formData.maThuoc} onChange={handleChange} className={styles.formInput} required />
      </div>

      {/* Loại thuốc */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Loại thuốc</label>
        <input type="text" name="loaiThuoc" value={formData.loaiThuoc} onChange={handleChange} className={styles.formInput} />
      </div>

      {/* Tên thuốc (Full Width) */}
      <div className={styles.formGroupFullWidth}>
        <label className={styles.formLabel}>Tên thuốc</label>
        <input type="text" name="tenThuoc" value={formData.tenThuoc} onChange={handleChange} className={styles.formInput} required />
      </div>

      {/* Số lượng */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Số lượng</label>
        <input type="number" name="soLuong" value={formData.soLuong} onChange={handleChange} className={styles.formInput} min="0" required />
      </div>

      {/* Giá Bán */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Giá bán (VNĐ)</label>
        <input type="number" name="giaBan" value={formData.giaBan} onChange={handleChange} className={styles.formInput} min="0" required />
      </div>

      {/* Ngày nhập */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Ngày nhập</label>
        <input type="date" name="ngayNhap" value={formData.ngayNhap} onChange={handleChange} className={styles.formInput} required />
      </div>

      {/* Hạn sử dụng */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Hạn sử dụng</label>
        <input type="date" name="hsd" value={formData.hsd} onChange={handleChange} className={styles.formInput} required />
      </div>

      {/* Nhà cung cấp (Full Width) */}
      <div className={styles.formGroupFullWidth}>
        <label className={styles.formLabel}>Nhà cung cấp</label>
        <input type="text" name="nhaCungCap" value={formData.nhaCungCap} onChange={handleChange} className={styles.formInput} />
      </div>

      {/* Buttons (Tự động full width) */}
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