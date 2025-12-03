// src/components/AdminForms/NhaCungCapForm.tsx
import React, { useState } from "react";
import { NhaCungCap } from "../../interfaces";
import { addNhaCungCap, updateNhaCungCap } from "../../api/nhaCungCapApi";
import styles from "../../styles/Form.module.css";

interface NhaCungCapFormProps {
  supplier: NhaCungCap | null;
  onSave: () => void;
  onClose: () => void;
}

export const NhaCungCapForm: React.FC<NhaCungCapFormProps> = ({ supplier, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<NhaCungCap>>({
    TenNhaCungCap: supplier?.TenNhaCungCap || "",
    DiaChi: supplier?.DiaChi || "",
    SoDienThoai: supplier?.SoDienThoai || "",
    Email: supplier?.Email || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    // Dữ liệu gửi đi (không cần MaNhaCungCap khi thêm mới)
    const dataToSave: Partial<NhaCungCap> = {
      TenNhaCungCap: formData.TenNhaCungCap,
      DiaChi: formData.DiaChi,
      SoDienThoai: formData.SoDienThoai,
      Email: formData.Email,
    };

    try {
      if (supplier && supplier.MaNhaCungCap) {
        // Chế độ Sửa
        await updateNhaCungCap(supplier.MaNhaCungCap, dataToSave);
      } else {
        // Chế độ Thêm
        await addNhaCungCap(dataToSave);
      }
      onSave();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        {/* Chỉ hiển thị Mã khi Sửa */}
        {supplier && (
          <div className={styles.formGroup}>
            <label htmlFor="MaNhaCungCap">Mã</label>
            <input
              type="text"
              id="MaNhaCungCap"
              name="MaNhaCungCap"
              value={supplier.MaNhaCungCap}
              disabled
              className={styles.disabledInput}
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="TenNhaCungCap">Tên nhà cung cấp *</label>
          <input
            placeholder="Nhập tên nhà cung cấp"
            type="text"
            id="TenNhaCungCap"
            name="TenNhaCungCap"
            value={formData.TenNhaCungCap}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="SoDienThoai">Số điện thoại</label>
          <input
            placeholder="Nhập số điện thoại"
            type="tel"
            id="SoDienThoai"
            name="SoDienThoai"
            value={formData.SoDienThoai}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="Email">Email</label>
          <input
            placeholder="Nhập email"
            type="email"
            id="Email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="DiaChi">Địa chỉ</label>
          <textarea
            placeholder="Nhập địa chỉ"
            id="DiaChi"
            name="DiaChi"
            rows={3}
            value={formData.DiaChi}
            onChange={handleChange}
            className={styles.fullWidthTextarea}
          />
        </div>
      </div>

      {formError && <div className={styles.errorText}>{formError}</div>}

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
      </div>
    </form>
  );
};
