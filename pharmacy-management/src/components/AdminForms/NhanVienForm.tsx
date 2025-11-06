// src/components/AdminForms/NhanVienForm.tsx
import React, { useState } from 'react';
// [SỬA LỖI] Import 'NhanVienUpdateData' từ 'interfaces'
import { NhanVien, NhanVienUpdateData } from '../../interfaces';
// [SỬA LỖI] Chỉ import hàm 'updateNhanVien' từ api
import { updateNhanVien } from '../../api/nhanVienApi';
import styles from '../../styles/Form.module.css';

interface NhanVienFormProps {
  initialData: NhanVien; // Form này chỉ dùng để SỬA
  onFormSubmitSuccess: () => void;
  onCancel: () => void;
}

export const NhanVienForm: React.FC<NhanVienFormProps> = ({ initialData, onFormSubmitSuccess, onCancel }) => {
  
  // [SỬA LỖI] Sử dụng kiểu 'NhanVienUpdateData'
  const [formData, setFormData] = useState<NhanVienUpdateData>({
    TenNhanVien: initialData.TenNhanVien,
    TaiKhoan: initialData.TaiKhoan,
    VaiTro: initialData.VaiTro,
    // Không bao gồm Mật khẩu ở đây
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // [SỬA LỖI] Thêm kiểu cho 'prev'
    setFormData((prev: NhanVienUpdateData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await updateNhanVien(initialData.MaNhanVien, formData);
      alert('Cập nhật thành công!');
      onFormSubmitSuccess();
    } catch (err) {
      setError((err as Error).message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}
      
      {/* Mã Nhân Viên (Chỉ đọc) */}
      <div className={styles.formGroup}>
        <label>Mã Nhân Viên</label>
        <input type="text" value={initialData.MaNhanVien} disabled />
      </div>

      {/* Tên Nhân Viên */}
      <div className={styles.formGroup}>
        <label>Tên Nhân Viên</label>
        <input
          type="text"
          name="TenNhanVien"
          value={formData.TenNhanVien || ''}
          onChange={handleChange}
          required
        />
      </div>

      {/* Tài Khoản */}
      <div className={styles.formGroup}>
        <label>Tài Khoản</label>
        <input
          type="text"
          name="TaiKhoan"
          value={formData.TaiKhoan || ''}
          onChange={handleChange}
          required
        />
      </div>

      {/* Vai Trò */}
      <div className={styles.formGroup}>
        <label>Vai Trò</label>
        <input
          type="text"
          name="VaiTro"
          value={formData.VaiTro || ''}
          onChange={handleChange}
          required
        />
      </div>

      {/* Nút bấm */}
      <div className={styles.buttonGroup}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Hủy
        </button>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  );
};