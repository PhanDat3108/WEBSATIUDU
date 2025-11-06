// src/components/AdminForms/MedicineForm.tsx
import React, { useState } from 'react';
import { Thuoc } from '../../interfaces';
import { addMedicine, updateMedicine } from '../../api/thuocApi';
import styles from '../../styles/Form.module.css';

interface MedicineFormProps {
  medicine: Thuoc | null;
  onSave: () => void;
  onClose: () => void;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

export const MedicineForm: React.FC<MedicineFormProps> = ({ medicine, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Thuoc>>({
    TenThuoc: medicine?.TenThuoc || '',
    DonViTinh: medicine?.DonViTinh || 'Viên',
    SoLuongTon: medicine?.SoLuongTon || 0,
    GiaNhap: medicine?.GiaNhap || 0,
    GiaBan: medicine?.GiaBan || 0,
    HanSuDung: medicine?.HanSuDung ? medicine.HanSuDung.split('T')[0] : getTodayString(),
    NgayNhap: medicine?.NgayNhap ? medicine.NgayNhap.split('T')[0] : getTodayString(),
    MaLoai: medicine?.MaLoai || '',
    NhaCungCap: medicine?.NhaCungCap || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (medicine) {
        // Chế độ Sửa
        // Gửi formData (PascalCase)
        await updateMedicine(medicine.MaThuoc, formData);
      } else {
        // Chế độ Thêm mới
        // [SỬA LỖI Ở ĐÂY]
        // Gửi formData (PascalCase)
        // Lỗi TS2559 của bạn sẽ biến mất.
        await addMedicine(formData);
      }
      
      alert('Lưu thành công!');
      onSave(); // Tải lại dữ liệu ở component cha
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      
      {/* Hàng 1: Tên thuốc, Đơn vị tính, Số lượng tồn */}
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="TenThuoc">Tên Thuốc *</label>
          <input
            type="text"
            id="TenThuoc"
            name="TenThuoc"
            value={formData.TenThuoc}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="DonViTinh">Đơn vị tính *</label>
          <input
            type="text"
            id="DonViTinh"
            name="DonViTinh"
            value={formData.DonViTinh}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="SoLuongTon">Số lượng tồn</label>
          <input
            type="number"
            id="SoLuongTon"
            name="SoLuongTon"
            value={formData.SoLuongTon}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Hàng 2: Giá nhập, Giá bán, Hạn sử dụng */}
        <div className={styles.formGroup}>
          <label htmlFor="GiaNhap">Giá nhập</label>
          <input
            type="number"
            id="GiaNhap"
            name="GiaNhap"
            value={formData.GiaNhap}
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="GiaBan">Giá bán *</label>
          <input
            type="number"
            id="GiaBan"
            name="GiaBan"
            value={formData.GiaBan}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="HanSuDung">Hạn sử dụng *</label>
          <input
            type="date"
            id="HanSuDung"
            name="HanSuDung"
            value={formData.HanSuDung}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Hàng 3: Ngày nhập, Mã loại, Mã NCC */}
        <div className={styles.formGroup}>
          <label htmlFor="NgayNhap">Ngày nhập</label>
          <input
            type="date"
            id="NgayNhap"
            name="NgayNhap"
            value={formData.NgayNhap}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="MaLoai">Mã Loại *</label>
          <input
            type="text"
            id="MaLoai"
            name="MaLoai"
            value={formData.MaLoai}
            onChange={handleChange}
            placeholder="VD: ML001 (Sẽ là Dropdown)"
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="NhaCungCap">Mã Nhà Cung Cấp *</label>
          <input
            type="text"
            id="NhaCungCap"
            name="NhaCungCap"
            value={formData.NhaCungCap}
            onChange={handleChange}
            placeholder="VD: NCC001 (Sẽ là Dropdown)"
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          {/* (Trống) */}
        </div>

      </div> {/* Đóng .formGrid */}

      {formError && (
        <div className={styles.errorText}>
          {formError}
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
        </button>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
      </div>
    </form>
  );
};