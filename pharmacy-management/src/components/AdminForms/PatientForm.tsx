import React, { useState, useEffect } from 'react';
import { Patient } from '../../interfaces'; 
import styles from '../../styles/Form.module.css';

type PatientFormData = Omit<Patient, 'id' | 'stt'>;

interface PatientFormProps {
  initialData?: Patient | null; 
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
}

const defaultFormState: PatientFormData = {
  maBenhNhan: '',
  tenBenhNhan: '',
  gioiTinh: 'Nam',
  tuoi: 0,
  diaChi: '',
  sdt: '',
  tienSuBenhAn: '',
};

const PatientForm: React.FC<PatientFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PatientFormData>(defaultFormState);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormState);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tuoi' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    // [BẮT BUỘC] Áp dụng layout Grid 2 cột
    <form className={styles.form} onSubmit={handleSubmit}>
      
      {/* Mã bệnh nhân */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Mã bệnh nhân</label>
        <input type="text" name="maBenhNhan" value={formData.maBenhNhan} onChange={handleChange} className={styles.formInput} required />
      </div>

      {/* Tên bệnh nhân */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Tên bệnh nhân</label>
        <input type="text" name="tenBenhNhan" value={formData.tenBenhNhan} onChange={handleChange} className={styles.formInput} required />
      </div>

      {/* Giới tính */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Giới tính</label>
        <select name="gioiTinh" value={formData.gioiTinh} onChange={handleChange} className={styles.formInput}>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>

      {/* Tuổi */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Tuổi</label>
        <input type="number" name="tuoi" value={formData.tuoi} onChange={handleChange} className={styles.formInput} min="0" required />
      </div>

      {/* Số điện thoại (Full Width) */}
      <div className={styles.formGroupFullWidth}>
        <label className={styles.formLabel}>Số điện thoại</label>
        <input type="tel" name="sdt" value={formData.sdt} onChange={handleChange} className={styles.formInput} />
      </div>

      {/* Địa chỉ (Full Width) */}
      <div className={styles.formGroupFullWidth}>
        <label className={styles.formLabel}>Địa chỉ</label>
        <textarea name="diaChi" value={formData.diaChi} onChange={handleChange} className={styles.formInput} rows={3} />
      </div>

      {/* Tiền sử bệnh án (Full Width) */}
      <div className={styles.formGroupFullWidth}>
        <label className={styles.formLabel}>Tiền sử bệnh án</label>
        <textarea name="tienSuBenhAn" value={formData.tienSuBenhAn} onChange={handleChange} className={styles.formInput} rows={3} />
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

export default PatientForm;