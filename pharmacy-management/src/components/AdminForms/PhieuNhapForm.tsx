// src/components/AdminForms/PhieuNhapForm.tsx
import React, { useState, useEffect } from 'react';
import { Thuoc, NhaCungCap, ChiTietNhapCreate, PhieuNhapCreatePayload } from '../../interfaces';
import { getNhaCungCapList } from '../../api/nhaCungCapApi';
import { getMedicines } from '../../api/thuocApi';
import { addPhieuNhap } from '../../api/phieuNhapApi';

// Import CSS cho form (sẽ tạo ở bước 5)
import styles from '../../styles/PhieuNhapForm.module.css';

// Props: Hàm để đóng Modal và hàm để báo cho trang cha tải lại (onSave)
interface PhieuNhapFormProps {
  onClose: () => void;
  onSave: () => void;
}

// Hàm helper lấy ngày hôm nay (YYYY-MM-DD)
const getTodayString = () => new Date().toISOString().split('T')[0];

export const PhieuNhapForm: React.FC<PhieuNhapFormProps> = ({ onClose, onSave }) => {
  
  // --- STATE QUẢN LÝ DỮ LIỆU TỪ API ---
  const [nhaCungCapList, setNhaCungCapList] = useState<NhaCungCap[]>([]);
  const [thuocList, setThuocList] = useState<Thuoc[]>([]);
  const [maNhanVien, setMaNhanVien] = useState<string>('');
  
  // --- STATE QUẢN LÝ FORM ---
  const [selectedNCC, setSelectedNCC] = useState<string>(''); // Lưu MaNhaCungCap
  const [chiTietRows, setChiTietRows] = useState<Partial<ChiTietNhapCreate>[]>([]);
  
  // --- STATE QUẢN LÝ TRẠNG THÁI UI ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const currentMaNV = localStorage.getItem('maNhanVien');
        if (!currentMaNV) {
          throw new Error('Không tìm thấy Mã Nhân Viên. Vui lòng đăng nhập lại.');
        }
        setMaNhanVien(currentMaNV);

        const [nccData, thuocData] = await Promise.all([
          getNhaCungCapList(),
          getMedicines()
        ]);
        
        setNhaCungCapList(nccData);
        setThuocList(thuocData);
        
        if (nccData.length > 0) {
          setSelectedNCC(nccData[0].MaNhaCungCap);
        }
        handleAddRow(); 

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []); 
  const handleAddRow = () => {
    setChiTietRows([
      ...chiTietRows,
      {
        MaThuoc: '',
        SoLuongNhap: 1,
        DonGiaNhap: 0,
        HanSuDung: getTodayString()
      }
    ]);
  };

  const handleRemoveRow = (indexToRemove: number) => {
    setChiTietRows(chiTietRows.filter((_, index) => index !== indexToRemove));
  };

  const handleRowChange = (index: number, field: keyof ChiTietNhapCreate, value: string | number) => {
    const newRows = [...chiTietRows];

    if (field === 'SoLuongNhap' || field === 'DonGiaNhap') {
      newRows[index][field] = Number(value);
    } else {
      newRows[index][field] = String(value);
    }
    
    setChiTietRows(newRows);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedNCC) {
      setError('Vui lòng chọn một nhà cung cấp.');
      return;
    }
    if (chiTietRows.length === 0) {
      setError('Phiếu nhập phải có ít nhất 1 loại thuốc.');
      return;
    }

    const validChiTiet: ChiTietNhapCreate[] = [];
    for (const row of chiTietRows) {
      if (!row.MaThuoc) {
        setError('Vui lòng chọn thuốc cho tất cả các dòng.');
        return;
      }
      if (!row.SoLuongNhap || row.SoLuongNhap <= 0) {
        setError(`Số lượng nhập cho ${row.MaThuoc} phải lớn hơn 0.`);
        return;
      }
       if (!row.DonGiaNhap || row.DonGiaNhap < 0) {
        setError(`Đơn giá nhập cho ${row.MaThuoc} không được âm.`);
        return;
      }
      if (!row.HanSuDung) {
        setError(`Vui lòng nhập Hạn sử dụng cho ${row.MaThuoc}.`);
        return;
      }
      validChiTiet.push(row as ChiTietNhapCreate);
    }

    const payload: PhieuNhapCreatePayload = {
      MaNhaCungCap: selectedNCC,
      MaNhanVien: maNhanVien,
      chiTiet: validChiTiet
    };

    setIsSubmitting(true);
    try {
      await addPhieuNhap(payload);
      alert('Thêm phiếu nhập thành công!');
      onSave(); 
      onClose(); 
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (error && !isSubmitting) return <div className={styles.errorText}>Lỗi: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="MaNhaCungCap">Nhà Cung Cấp *</label>
          <select
            id="MaNhaCungCap"
            name="MaNhaCungCap"
            value={selectedNCC}
            onChange={(e) => setSelectedNCC(e.target.value)}
            required
          >
            {nhaCungCapList.map(ncc => (
              <option key={ncc.MaNhaCungCap} value={ncc.MaNhaCungCap}>
                {ncc.TenNhaCungCap}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="MaNhanVien">Nhân Viên Nhập</label>
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
      <h3 className={styles.tableTitle}>Chi Tiết Thuốc</h3>
      <table className={styles.chiTietTable}>
        <thead>
          <tr>
            <th>Thuốc *</th>
            <th>Số Lượng *</th>
            <th>Đơn Giá Nhập *</th>
            <th>Hạn Sử Dụng *</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {chiTietRows.map((row, index) => (
            <tr key={index}>
              <td>
                <select
                  name="MaThuoc"
                  value={row.MaThuoc}
                  onChange={(e) => handleRowChange(index, 'MaThuoc', e.target.value)}
                  required
                >
                  <option value="" disabled>-- Chọn thuốc --</option>
                  {thuocList.map(thuoc => (
                    <option key={thuoc.MaThuoc} value={thuoc.MaThuoc}>
                      {thuoc.TenThuoc} ({thuoc.DonViTinh})
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  name="SoLuongNhap"
                  value={row.SoLuongNhap}
                  onChange={(e) => handleRowChange(index, 'SoLuongNhap', e.target.value)}
                  min="1"
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  name="DonGiaNhap"
                  value={row.DonGiaNhap}
                  onChange={(e) => handleRowChange(index, 'DonGiaNhap', e.target.value)}
                  min="0"
                  required
                />
              </td>
              <td>
                <input
                  type="date"
                  name="HanSuDung"
                  value={row.HanSuDung}
                  onChange={(e) => handleRowChange(index, 'HanSuDung', e.target.value)}
                  required
                />
              </td>
            
              <td>
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className={styles.removeRowButton}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" onClick={handleAddRow} className={styles.addRowButton}>
        + Thêm Thuốc
      </button>


      {error && (
        <div className={styles.errorText}>
          {error}
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu Phiếu Nhập'}
        </button>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Hủy
        </button>
      </div>
    </form>
  );
};