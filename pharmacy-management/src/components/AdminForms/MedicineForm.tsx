// src/components/AdminForms/MedicineForm.tsx
import React, { useState, useEffect } from 'react';
import { Thuoc, LoaiThuoc, NhaCungCap } from '../../interfaces';
import styles from '../../styles/Form.module.css';

// [SỬA LỖI IMPORT]
// 1. Import hàm thêm/sửa thuốc từ 'thuocApi'
import { addMedicine, updateMedicine } from '../../api/thuocApi'; 
// 2. Import hàm lấy tên loại thuốc từ 'loaiThuocApi' (File mới của bạn)
import { getLoaiThuocListname } from '../../api/loaiThuocApi';
// 3. Import hàm lấy tên NCC từ 'nhaCungCapApi'
import { getNhaCungCapListForDropdown } from '../../api/nhaCungCapApi';

interface MedicineFormProps {
  medicine: Thuoc | null;
  onSave: () => void;
  onClose: () => void;
}

export const MedicineForm: React.FC<MedicineFormProps> = ({ medicine, onSave, onClose }) => {
  
  const [formData, setFormData] = useState<Partial<Thuoc>>({
    MaThuoc: medicine?.MaThuoc || '',
    TenThuoc: medicine?.TenThuoc || '',
    DonViTinh: medicine?.DonViTinh || 'Viên',
    MaLoai: medicine?.MaLoai || '',
    MaNhaCungCap: medicine?.MaNhaCungCap || '',
    SoLuongTon: medicine?.SoLuongTon || 0,
    GiaNhap: medicine?.GiaNhap || 0,
    GiaBan: medicine?.GiaBan || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // State để lưu danh sách cho dropdown
  const [loaiThuocList, setLoaiThuocList] = useState<Pick<LoaiThuoc, 'MaLoai' | 'TenLoai'>[]>([]);
  const [nhaCungCapList, setNhaCungCapList] = useState<Pick<NhaCungCap, 'MaNhaCungCap' | 'TenNhaCungCap'>[]>([]);

  // Dùng useEffect để tải dữ liệu cho dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFormError(null);
        
        // Gọi API song song
        const [loaiData, nccData] = await Promise.all([
          getLoaiThuocListname(), // Gọi hàm từ loaiThuocApi.ts
          getNhaCungCapListForDropdown() // Gọi hàm từ nhaCungCapApi.ts
        ]);
        
        setLoaiThuocList(loaiData);
        setNhaCungCapList(nccData);

      } catch (err: any) {
        console.error("Lỗi khi tải dữ liệu form:", err);
        setFormError(err.message || "Không thể tải dữ liệu cho các ô lựa chọn.");
      }
    };
    fetchData();
  }, []); // [] đảm bảo chỉ chạy 1 lần

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // [FIX] Xử lý giá trị number
    if (name === 'GiaBan') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseFloat(value) // Chuyển sang số
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Kiểm tra validation cho <select>
    if (!formData.MaLoai) {
      setFormError("Vui lòng chọn một loại thuốc.");
      return;
    }
    if (!formData.MaNhaCungCap) {
      setFormError("Vui lòng chọn một nhà cung cấp.");
      return;
    }
    
    // [FIX] Kiểm tra giá bán
    if (formData.GiaBan === undefined || formData.GiaBan < 0) {
       setFormError("Giá bán không hợp lệ.");
      return;
    }


    setIsSubmitting(true);

    try {
      // [FIX] Thêm "GiaBan" vào dataToSave.
      // Backend của bạn đã hỗ trợ nhận GiaBan ở cả route "add" và "fix".
      const dataToSave: Partial<Thuoc> = {
        TenThuoc: formData.TenThuoc,
        DonViTinh: formData.DonViTinh,
        MaLoai: formData.MaLoai,
        MaNhaCungCap: formData.MaNhaCungCap,
        GiaBan: formData.GiaBan || 0 // Đảm bảo gửi giá trị
      };

      if (medicine && medicine.MaThuoc) {
        await updateMedicine(medicine.MaThuoc, dataToSave); // Từ thuocApi.ts
      } else {
        await addMedicine(dataToSave); // Từ thuocApi.ts
      }
      onSave();
      onClose();
    } catch (error: any) {
      setFormError(error.message || 'Lỗi khi lưu thuốc.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!medicine;

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formGrid}>
        
        {isEditMode && (
          <div className={styles.formGroup}>
            <label htmlFor="MaThuoc">Mã Thuốc</label>
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
          <label htmlFor="TenThuoc">Tên Thuốc</label>
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
          <label htmlFor="DonViTinh">Đơn Vị Tính</label>
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
            <option value="Gói">Gói</option>
          </select>
        </div>

        {/* Đổi <input> thành <select> */}
        <div className={styles.formGroup}>
          <label htmlFor="MaLoai">Loại Thuốc</label>
          <select
            id="MaLoai"
            name="MaLoai"
            value={formData.MaLoai}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn loại thuốc --</option>
            {loaiThuocList.map(loai => (
              <option key={loai.MaLoai} value={loai.MaLoai}>
                {loai.TenLoai}
              </option>
            ))}
          </select>
        </div>
        
        {/* Đổi <input> thành <select> */}
        <div className={styles.formGroup}>
          <label htmlFor="MaNhaCungCap">Nhà Cung Cấp</label>
          <select
            id="MaNhaCungCap"
            name="MaNhaCungCap"
            value={formData.MaNhaCungCap}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn nhà cung cấp --</option>
            {nhaCungCapList.map(ncc => (
              <option key={ncc.MaNhaCungCap} value={ncc.MaNhaCungCap}>
                {ncc.TenNhaCungCap}
              </option>
            ))}
          </select>
        </div>
        
        {/* [FIX] Di chuyển Giá Bán ra ngoài và cho phép chỉnh sửa */}
        <div className={styles.formGroup}>
          <label htmlFor="GiaBan">Giá bán (VNĐ)</label>
          <input
            type="number"
            id="GiaBan"
            name="GiaBan"
            value={formData.GiaBan}
            onChange={handleChange} // Cho phép thay đổi
            min="0" // Đảm bảo giá không âm
            required
            // Đã loại bỏ 'disabled' và 'className'
          />
        </div>

        {/* Các trường còn lại (chỉ hiển thị ở Edit Mode và vẫn disabled) */}
        {isEditMode && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="SoLuongTon">Số Lượng Tồn</label>
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
            
            {/* [FIX] Đã di chuyển ô Giá Bán ra ngoài khối này */}
            
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

