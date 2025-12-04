// src/components/AdminForms/LoaiThuocForm.tsx
import React, { useState } from "react";
import { LoaiThuoc } from "../../interfaces";
import { addLoaiThuoc, updateLoaiThuoc } from "../../api/loaiThuocApi";
import styles from "../../styles/Form.module.css";

interface LoaiThuocFormProps {
  loaiThuoc: LoaiThuoc | null;
  onSave: () => void;
  onClose: () => void;
}

export const LoaiThuocForm: React.FC<LoaiThuocFormProps> = ({ loaiThuoc, onSave, onClose }) => {
  const [tenLoai, setTenLoai] = useState(loaiThuoc?.TenLoai || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const dataToSave: Partial<LoaiThuoc> = {
      TenLoai: tenLoai,
    };

    try {
      if (loaiThuoc && loaiThuoc.MaLoai) {
        // Chế độ Sửa
        await updateLoaiThuoc(loaiThuoc.MaLoai, dataToSave);
      } else {
        // Chế độ Thêm
        await addLoaiThuoc(dataToSave);
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
      <div>
        {/* Chỉ hiển thị Mã khi Sửa */}
        {loaiThuoc && (
          <div className={styles.formGroup}>
            <label htmlFor="MaLoai">Mã loại</label>
            <input
              type="text"
              id="MaLoai"
              name="MaLoai"
              value={loaiThuoc.MaLoai}
              disabled
              className={styles.disabledInput}
            />
          </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="TenLoai">Tên loại thuốc *</label>
          <input
            placeholder="Nhập tên loại thuốc"
            type="text"
            id="TenLoai"
            name="TenLoai"
            value={tenLoai}
            onChange={(e) => setTenLoai(e.target.value)}
            required
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
