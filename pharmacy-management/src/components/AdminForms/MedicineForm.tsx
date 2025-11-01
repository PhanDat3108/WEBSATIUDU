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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: (name === 'SoLuongTon' || name === 'GiaNhap' || name === 'GiaBan')
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const formDataPascal = formData;

      const dataToSend = {
        tenThuoc: formDataPascal.TenThuoc,
        donViTinh: formDataPascal.DonViTinh,
        soLuongTon: formDataPascal.SoLuongTon,
        giaNhap: formDataPascal.GiaNhap,
        giaBan: formDataPascal.GiaBan,
        hanSuDung: formDataPascal.HanSuDung,
        ngayNhap: formDataPascal.NgayNhap,
        maLoai: formDataPascal.MaLoai,
        nhaCungCap: formDataPascal.NhaCungCap,
      };
      
      if (!dataToSend.tenThuoc || !dataToSend.donViTinh || !dataToSend.hanSuDung || !dataToSend.maLoai || !dataToSend.giaBan) {
         throw new Error('Vui lòng điền đủ Tên, ĐVT, HSD, Mã Loại, Giá Bán.');
      }

      if (medicine) {
        // Chế độ Sửa (gửi data camelCase)
        await updateMedicine(medicine.MaThuoc, dataToSend);
      } else {
        // Chế độ Thêm mới (gửi data camelCase)
        // SỬA LỖI Ở ĐÂY: Xóa bỏ phần ép kiểu
        await addMedicine(dataToSend);
      }
      
      alert('Lưu thành công!');
      onSave();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>{medicine ? 'Sửa thông tin thuốc' : 'Thêm thuốc mới'}</h2>

      {/* Bố cục 2 cột */}
      <div className={styles.formGrid}>
        
        {/* Cột 1 */}
        <div className={styles.formGroup}>
          <label htmlFor="TenThuoc">Tên thuốc *</label>
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

        {/* Cột 2 */}
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
          {isSubmitting ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
          Hủy
        </button>
      </div>
    </form>
  );
};