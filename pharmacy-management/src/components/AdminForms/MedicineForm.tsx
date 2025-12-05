

// src/components/AdminForms/MedicineForm.tsx
import React, { useState, useEffect } from "react";
import { Thuoc, LoaiThuoc, NhaCungCap } from "../../interfaces";
import styles from "../../styles/Form.module.css";

// 1. Import hàm thêm/sửa thuốc và hàm upload ảnh
import { addMedicine, updateMedicine, uploadMedicineImage } from "../../api/thuocApi";
import { getLoaiThuocListname } from "../../api/loaiThuocApi";
import { getNhaCungCapListForDropdown } from "../../api/nhaCungCapApi";

interface MedicineFormProps {
  medicine: Thuoc | null;
  onSave: () => void;
  onClose: () => void;
}

export const MedicineForm: React.FC<MedicineFormProps> = ({ medicine, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Thuoc>>({
    MaThuoc: medicine?.MaThuoc || "",
    TenThuoc: medicine?.TenThuoc || "",
    DonViTinh: medicine?.DonViTinh || "Viên",
    MaLoai: medicine?.MaLoai || "",
    MaNhaCungCap: medicine?.MaNhaCungCap || "",
    SoLuongTon: medicine?.SoLuongTon || 0,
    GiaNhap: medicine?.GiaNhap || 0,
    GiaBan: medicine?.GiaBan || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // --- STATE CHO ẢNH ---
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // Lưu cái đường link tạm thời để hiển thị ảnh lên màn hình cho người dùng xem trước
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // ---------------------

  const [loaiThuocList, setLoaiThuocList] = useState<Pick<LoaiThuoc, "MaLoai" | "TenLoai">[]>([]);
  const [nhaCungCapList, setNhaCungCapList] = useState<Pick<NhaCungCap, "MaNhaCungCap" | "TenNhaCungCap">[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFormError(null);
        const [loaiData, nccData] = await Promise.all([getLoaiThuocListname(), getNhaCungCapListForDropdown()]);
        setLoaiThuocList(loaiData);
        setNhaCungCapList(nccData);
      } catch (err: any) {
        console.error("Lỗi khi tải dữ liệu form:", err);
        setFormError(err.message || "Không thể tải dữ liệu cho các ô lựa chọn.");
      }
    };
    fetchData();

    // --- XỬ LÝ HIỂN THỊ ẢNH CŨ KHI SỬA ---
    if (medicine?.MaThuoc) {
      // Đường dẫn ảnh từ server (Backend cần serve folder public/images/thuoc)
      // Thêm timestamp ?t=... để tránh cache trình duyệt khi thay đổi ảnh
      setPreviewImage(`http://localhost:5000/images/thuoc/${medicine.MaThuoc}.jpg?t=${new Date().getTime()}`);
    }
  }, [medicine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "GiaBan") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // --- HÀM XỬ LÝ KHI CHỌN FILE ẢNH ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      // Tạo URL tạm thời để hiển thị preview ngay lập tức
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.MaLoai || !formData.MaNhaCungCap) {
      setFormError("Vui lòng chọn loại thuốc và nhà cung cấp.");
      return;
    }
    if (formData.GiaBan === undefined || formData.GiaBan < 0) {
      setFormError("Giá bán không hợp lệ.");
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSave: Partial<Thuoc> = {
        TenThuoc: formData.TenThuoc,
        DonViTinh: formData.DonViTinh,
        MaLoai: formData.MaLoai,
        MaNhaCungCap: formData.MaNhaCungCap,
        GiaBan: formData.GiaBan || 0,
      };

      let finalMaThuoc = medicine?.MaThuoc;

      // 1. Lưu thông tin thuốc (Text data)
      if (medicine && medicine.MaThuoc) {
        await updateMedicine(medicine.MaThuoc, dataToSave);
      } else {
        const response = await addMedicine(dataToSave);
        // Giả sử API trả về object thuốc vừa tạo có chứa MaThuoc hoặc insertId
        // Bạn cần kiểm tra lại response backend trả về gì khi create
        finalMaThuoc = response.MaThuoc;
      }

      // 2. Upload ảnh (nếu có chọn ảnh mới và đã có MaThuoc)
      if (selectedImage && finalMaThuoc) {
        await uploadMedicineImage(String(finalMaThuoc), selectedImage);
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error(error);
      setFormError(error.message || "Lỗi khi lưu thuốc.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!medicine;

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formGrid}>
        {/* --- KHU VỰC HIỂN THỊ VÀ CHỌN ẢNH (New) --- */}
        <div
          className={styles.formGroup}
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <label>Hình ảnh thuốc</label>
          <div
            style={{
              width: "150px",
              height: "150px",
              border: "1px dashed #ccc",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  // Nếu lỗi load ảnh (ví dụ thuốc chưa có ảnh), hiện placeholder
                  e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            ) : (
              <span style={{ color: "#aaa" }}>Chưa có ảnh</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: "0.9rem" }} />
        </div>
        {/* ------------------------------------------ */}

        {isEditMode && (
          <div className={styles.formGroup}>
            <label htmlFor="MaThuoc">Mã thuốc</label>
            <input
              type="text"
              id="MaThuoc"
              name="MaThuoc"
              value={formData.MaThuoc}
              disabled
              className={styles.disabledInput}
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="TenThuoc">Tên thuốc</label>
          <input
            type="text"
            id="TenThuoc"
            name="TenThuoc"
            value={formData.TenThuoc}
            placeholder="Nhập tên thuốc"
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="DonViTinh">Đơn vị tính</label>
          <select id="DonViTinh" name="DonViTinh" value={formData.DonViTinh} onChange={handleChange} required>
            <option value="Viên">Viên</option>
            <option value="Vỉ">Vỉ</option>
            <option value="Hộp">Hộp</option>
            <option value="Chai">Chai</option>
            <option value="Tuýp">Tuýp</option>
            <option value="Gói">Gói</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="MaLoai">Loại thuốc</label>
          <select id="MaLoai" name="MaLoai" value={formData.MaLoai} onChange={handleChange} required>
            <option value="">-- Chọn loại thuốc --</option>
            {loaiThuocList.map((loai) => (
              <option key={loai.MaLoai} value={loai.MaLoai}>
                {loai.TenLoai}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="MaNhaCungCap">Nhà cung cấp</label>
          <select id="MaNhaCungCap" name="MaNhaCungCap" value={formData.MaNhaCungCap} onChange={handleChange} required>
            <option value="">-- Chọn nhà cung cấp --</option>
            {nhaCungCapList.map((ncc) => (
              <option key={ncc.MaNhaCungCap} value={ncc.MaNhaCungCap}>
                {ncc.TenNhaCungCap}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="GiaBan">Giá bán (VNĐ)</label>
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

        {isEditMode && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="SoLuongTon">Số lượng tồn</label>
              <input
                type="number"
                id="SoLuongTon"
                name="SoLuongTon"
                value={formData.SoLuongTon}
                disabled
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
                disabled
                className={styles.disabledInput}
              />
            </div>
          </>
        )}
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
