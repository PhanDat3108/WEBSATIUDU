// src/components/AdminForms/MedicineForm.tsx
import React, { useState } from 'react';
import { Thuoc } from '../../interfaces'; //
import { addMedicine, updateMedicine } from '../../api/thuocApi';
import styles from '../../styles/Form.module.css';

interface MedicineFormProps {
  medicine: Thuoc | null;
  onSave: () => void;
  onClose: () => void;
}

export const MedicineForm: React.FC<MedicineFormProps> = ({ medicine, onSave, onClose }) => {
  
  // [CẬP NHẬT] Lấy tất cả thông tin để hiển thị
  const [formData, setFormData] = useState<Partial<Thuoc>>({
    MaThuoc: medicine?.MaThuoc || '', // Hiển thị khi sửa
    TenThuoc: medicine?.TenThuoc || '',
    DonViTinh: medicine?.DonViTinh || 'Viên',
    MaLoai: medicine?.MaLoai || '',
    MaNhaCungCap: medicine?.MaNhaCungCap || '',
    
    // Các trường chỉ hiển thị, không sửa
    SoLuongTon: medicine?.SoLuongTon || 0,
    GiaNhap: medicine?.GiaNhap || 0,
    GiaBan: medicine?.GiaBan || 0,
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

    // [GIỮ NGUYÊN] Dữ liệu gửi đi CHỈ chứa các trường được phép sửa
    const dataToSave: Partial<Thuoc> = {
      TenThuoc: formData.TenThuoc,
      DonViTinh: formData.DonViTinh,
      MaLoai: formData.MaLoai,
      MaNhaCungCap: formData.MaNhaCungCap,
    };
    
    // Khi thêm mới (medicine = null), API sẽ tự gán MaThuoc và các giá trị số = 0
    // Khi cập nhật (updateMedicine), API sẽ chỉ cập nhật 4 trường trong dataToSave.

    try {
      if (medicine && medicine.MaThuoc) {
        // Chế độ Sửa
        await updateMedicine(medicine.MaThuoc, dataToSave);
      } else {
        // Chế độ Thêm
        await addMedicine(dataToSave); 
      }
      onSave(); // Gọi hàm onSave để tải lại dữ liệu
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        
        {/* [MỚI] Hàng 1: Chỉ hiển thị khi ở chế độ "Sửa" */}
        {medicine && (
          <div className={styles.formGroup}>
            <label htmlFor="MaThuoc">Mã Thuốc</label>
            <input
              type="text"
              id="MaThuoc"
              name="MaThuoc"
              value={formData.MaThuoc}
              disabled // Không cho sửa
              className={styles.disabledInput} // Thêm class để CSS nhận diện
            />
          </div>
        )}

        {/* Hàng 2: Tên Thuốc, Đơn Vị Tính (Luôn cho sửa) */}
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
          <select
            id="DonViTinh"
            name="DonViTinh"
            value={formData.DonViTinh}
            onChange={handleChange}
            required
          >
            <option value="Viên">Viên</option>
            <option value="Vỉ">Vỉ</option>
            <option value="Hộp">Hộp</option>
            <option value="Chai">Chai</option>
            <option value="Tuýp">Tuýp</option>
          </select>
        </div>
        
        {/* Hàng 3: Mã loại, Mã NCC (Luôn cho sửa) */}
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
          <label htmlFor="MaNhaCungCap">Mã Nhà Cung Cấp *</label>
          <input
            type="text"
            id="MaNhaCungCap"
            name="MaNhaCungCap"
            value={formData.MaNhaCungCap}
            onChange={handleChange}
            placeholder="VD: NCC001 (Sẽ là Dropdown)"
            required
          />
        </div>

        {/* [MỚI] Hàng 4: Các trường chỉ hiển thị khi sửa */}
        {medicine && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="SoLuongTon">Số lượng tồn</label>
              <input
                type="number"
                id="SoLuongTon"
                name="SoLuongTon"
                value={formData.SoLuongTon}
                disabled // Không cho sửa
                className={styles.disabledInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="GiaNhap">Giá nhập (VNĐ)</label>
              <input
                type="number"
                id="GiaNhap"
                name="GiaNhap"
                value={formData.GiaNhap}
                disabled // Không cho sửa
                className={styles.disabledInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="GiaBan">Giá bán (VNĐ)</label>
              <input
                type="number"
                id="GiaBan"
                name="GiaBan"
                value={formData.GiaBan}
                disabled // Không cho sửa
                className={styles.disabledInput}
              />
            </div>
          </>
        )}

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
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
      </div>
    </form>
  );
};