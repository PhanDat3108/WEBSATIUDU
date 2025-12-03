// src/components/AdminForms/PatientForm.tsx
import React, { useState } from "react";
import { BenhNhan } from "../../interfaces";
import { addPatient, updatePatient } from "../../api/benhNhanApi";
import styles from "../../styles/Form.module.css";

interface PatientFormProps {
  patient: BenhNhan | null;
  onSave: () => void;
  onClose: () => void;
}

const getTodayString = () => new Date().toISOString().split("T")[0];

export const PatientForm: React.FC<PatientFormProps> = ({ patient, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<BenhNhan>>({
    TenBenhNhan: patient?.TenBenhNhan || "",
    NgaySinh: patient?.NgaySinh ? patient.NgaySinh.split("T")[0] : getTodayString(),
    GioiTinh: patient?.GioiTinh || "Nam",
    SoDienThoai: patient?.SoDienThoai || "",
    DiaChi: patient?.DiaChi || "",
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
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (patient) {
        await updatePatient(patient.MaBenhNhan, formData);
      } else {
        await addPatient(formData as Omit<BenhNhan, "MaBenhNhan">);
      }
      alert("Lưu thành công!");
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
        <div className={styles.formGroup}>
          <label htmlFor="TenBenhNhan">Tên bệnh nhân *</label>
          <input
            type="text"
            id="TenBenhNhan"
            name="TenBenhNhan"
            value={formData.TenBenhNhan}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="NgaySinh">Ngày sinh</label>
          <input type="date" id="NgaySinh" name="NgaySinh" value={formData.NgaySinh} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="GioiTinh">Giới tính</label>
          <select id="GioiTinh" name="GioiTinh" value={formData.GioiTinh} onChange={handleChange}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="SoDienThoai">Số điện thoại</label>
          <input type="tel" id="SoDienThoai" name="SoDienThoai" value={formData.SoDienThoai} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="DiaChi">Địa chỉ</label>
          <textarea id="DiaChi" name="DiaChi" value={formData.DiaChi} onChange={handleChange} rows={3} />
        </div>

        {formError && <div className={styles.errorText}>{formError}</div>}
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
        <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
          Hủy
        </button>
      </div>
    </form>
  );
};
