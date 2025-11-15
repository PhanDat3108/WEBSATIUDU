// src/components/AdminForms/XuatNoiBoForm.tsx
import React, { useState, useEffect } from 'react';
import { Thuoc, ChiTietXuatNoiBoCreate, PhieuXuatNoiBoCreatePayload } from '../../interfaces';
import { getMedicines } from '../../api/thuocApi';
import { addXuatNoiBo } from '../../api/xuatNoiBoApi';

// Dùng chung CSS với PhieuNhapForm
import styles from '../../styles/PhieuNhapForm.module.css';

interface XuatNoiBoFormProps {
  onClose: () => void;
  onSave: () => void;
}

// Kiểu dữ liệu nội bộ cho 1 hàng (row)
interface FormRow extends Partial<ChiTietXuatNoiBoCreate> {
  // Dùng để lưu thông tin đầy đủ của thuốc khi chọn
  selectedThuoc?: Thuoc; 
}

export const XuatNoiBoForm: React.FC<XuatNoiBoFormProps> = ({ onClose, onSave }) => {
  
  const [allMedicines, setAllMedicines] = useState<Thuoc[]>([]);
  const [maNhanVien, setMaNhanVien] = useState<string>('');
  
  // --- STATE QUẢN LÝ FORM ---
  const [loaiXuat, setLoaiXuat] = useState<'Bỏ' | 'Khác'>('Bỏ');
  const [chiTietRows, setChiTietRows] = useState<FormRow[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<number, string | null>>({}); // Lỗi tồn kho

  // --- 1. TẢI DỮ LIỆU BAN ĐẦU ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const currentMaNV = localStorage.getItem('maNhanVien'); 
        if (!currentMaNV) {
          throw new Error('Không tìm thấy Mã Nhân Viên. Vui lòng đăng nhập lại.');
        }
        setMaNhanVien(currentMaNV);

        const thuocData = await getMedicines();
        // Chỉ lấy thuốc CÒN HÀNG
        setAllMedicines(thuocData.filter(t => t.SoLuongTon > 0));
        
        // Tự động thêm 1 hàng trống
        handleAddRow(); 

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []); // Chỉ chạy 1 lần

  // --- 2. HÀM XỬ LÝ BẢNG CHI TIẾT ĐỘNG ---
  const handleAddRow = () => {
    setChiTietRows([...chiTietRows, { MaThuoc: '', SoLuongXuat: 1, DonGiaXuat: 0 }]);
  };

  const handleRemoveRow = (indexToRemove: number) => {
    setChiTietRows(chiTietRows.filter((_, index) => index !== indexToRemove));
    setRowErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[indexToRemove];
      return newErrors;
    });
  };

  // Cập nhật dữ liệu khi người dùng thay đổi 1 ô
  const handleRowChange = (index: number, field: keyof FormRow, value: string | number) => {
    const newRows = [...chiTietRows];
    const newRowErrors = { ...rowErrors };
    
    // Xóa lỗi cũ của hàng này
    newRowErrors[index] = null; 

    // @ts-ignore
    newRows[index][field] = value;

    // --- Logic tự động ---
    if (field === 'MaThuoc') {
      const selected = allMedicines.find(t => t.MaThuoc === value);
      if (selected) {
        newRows[index].selectedThuoc = selected;
        // Tự động điền Giá Vốn (GiaNhap) vào DonGiaXuat
        newRows[index].DonGiaXuat = selected.GiaNhap; 
        
        // [SỬA LỖI] Dùng (?? 0) để xử lý lỗi 'undefined'
        if ((newRows[index].SoLuongXuat ?? 0) > selected.SoLuongTon) {
           newRowErrors[index] = `Tồn kho không đủ (Tồn: ${selected.SoLuongTon})`;
        }
      }
    }
    
    if (field === 'SoLuongXuat') {
      const selected = newRows[index].selectedThuoc;
      if (selected) {
         // Kiểm tra tồn kho khi thay đổi số lượng
        if (Number(value) > selected.SoLuongTon) {
          newRowErrors[index] = `Tồn kho không đủ (Tồn: ${selected.SoLuongTon})`;
        }
      }
      if (Number(value) <= 0) {
        newRowErrors[index] = "Số lượng phải > 0";
      }
    }

    setChiTietRows(newRows);
    setRowErrors(newRowErrors);
  };

  // --- 3. HÀM SUBMIT FORM ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Kiểm tra nếu có bất kỳ lỗi tồn kho nào
    if (Object.values(rowErrors).some(err => err !== null)) {
       setError("Vui lòng sửa các lỗi trong bảng chi tiết trước khi lưu.");
       return;
    }

    const validChiTiet: ChiTietXuatNoiBoCreate[] = [];
    for (const row of chiTietRows) {
      if (!row.MaThuoc || !row.SoLuongXuat || row.SoLuongXuat <= 0 || row.DonGiaXuat === undefined) {
        setError('Dữ liệu chi tiết thuốc không hợp lệ. Vui lòng kiểm tra lại.');
        return;
      }
      validChiTiet.push({
        MaThuoc: row.MaThuoc,
        SoLuongXuat: row.SoLuongXuat,
        DonGiaXuat: row.DonGiaXuat,
      });
    }
    
    if (validChiTiet.length === 0) {
       setError('Phiếu xuất phải có ít nhất 1 loại thuốc.');
       return;
    }

    // --- Gửi Payload ---
    const payload: PhieuXuatNoiBoCreatePayload = {
      MaNhanVien: maNhanVien,
      LoaiXuat: loaiXuat,
      chiTiet: validChiTiet
    };

    setIsSubmitting(true);
    try {
      await addXuatNoiBo(payload);
      alert('Tạo phiếu xuất nội bộ thành công!');
      onSave(); 
      onClose(); 
    } catch (err) {
      setError((err as Error).message); // Hiển thị lỗi từ backend (VD: Lỗi tồn kho)
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER ---
  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  // Sửa lỗi hiển thị: Chỉ hiển thị lỗi nếu có lỗi VÀ không đang submit
  if (error && !isSubmitting) return <div className={styles.errorText}>Lỗi: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Hàng 1: Thông tin chung */}
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="LoaiXuat">Loại Xuất *</label>
          <select
            id="LoaiXuat"
            name="LoaiXuat"
            value={loaiXuat}
            onChange={(e) => setLoaiXuat(e.target.value as 'Bỏ' | 'Khác')}
            required
          >
            <option value="Bỏ">Bỏ (Hủy thuốc)</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="MaNhanVien">Nhân Viên Xuất</label>
          <input
            type="text"
            id="MaNhanVien"
            name="MaNhanVien"
            value={maNhanVien}
            disabled
            className={styles.disabledInput}
          />
        </div>
      </div>

      {/* Hàng 2: Bảng chi tiết thuốc */}
      <h3 className={styles.tableTitle}>Chi Tiết Thuốc Xuất</h3>
      <table className={styles.chiTietTable}>
        <thead>
          <tr>
            <th>Thuốc (Chỉ hiện thuốc còn tồn) *</th>
            <th>Giá Vốn (Tự điền)</th>
            <th>Số Lượng Xuất *</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {chiTietRows.map((row, index) => (
            <tr key={index}>
              {/* Ô 1: Chọn Thuốc */}
              <td>
                <select
                  name="MaThuoc"
                  value={row.MaThuoc}
                  onChange={(e) => handleRowChange(index, 'MaThuoc', e.target.value)}
                  required
                >
                  <option value="" disabled>-- Chọn thuốc --</option>
                  {allMedicines.length === 0 && (
                    <option disabled>Không có thuốc nào trong kho</option>
                  )}
                  {allMedicines.map(thuoc => (
                    <option key={thuoc.MaThuoc} value={thuoc.MaThuoc}>
                      {thuoc.TenThuoc} (Tồn: {thuoc.SoLuongTon})
                    </option>
                  ))}
                </select>
              </td>
              {/* Ô 2: Đơn Giá (Giá Vốn) */}
              <td>
                <input
                  type="number"
                  name="DonGiaXuat"
                  value={row.DonGiaXuat}
                  readOnly // Chỉ đọc, không cho sửa
                  className={styles.disabledInput}
                />
              </td>
              {/* Ô 3: Số Lượng Xuất */}
              <td>
                <input
                  type="number"
                  name="SoLuongXuat"
                  value={row.SoLuongXuat}
                  onChange={(e) => handleRowChange(index, 'SoLuongXuat', e.target.value)}
                  min="1"
                  required
                />
                {/* Hiển thị lỗi tồn kho ngay dưới ô */}
                {rowErrors[index] && <div className={styles.errorTextSmall}>{rowErrors[index]}</div>}
              </td>
              {/* Ô 4: Nút Xóa */}
              <td>
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className={styles.removeRowButton}
                  disabled={chiTietRows.length <= 1}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* CSS cho lỗi nhỏ (Thêm vào PhieuNhapForm.module.css nếu bạn muốn) */}
      <style>{`
        .errorTextSmall { color: red; font-size: 0.85rem; margin-top: 4px; }
      `}</style>
      
      <button type="button" onClick={handleAddRow} className={styles.addRowButton}>
        + Thêm Thuốc
      </button>

      {/* Hàng 3: Nút Submit và Lỗi */}
      {error && (
        <div className={styles.errorText}>
          {error}
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.saveButton} disabled={isSubmitting || Object.values(rowErrors).some(e => e)}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu Phiếu Xuất'}
        </button>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
      </div>
    </form>
  );
};