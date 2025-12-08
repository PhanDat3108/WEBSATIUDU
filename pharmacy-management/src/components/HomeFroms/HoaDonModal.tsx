// src/components/HomeFroms/HoaDonModal.tsx
import React, { useState } from 'react';
import { SanPhamTuiHang } from '../../contexts/TuiHangContext';
// [MỚI] Import thêm updatePatient và findPatientByPhone
import { addPatient, updatePatient, findPatientByPhone } from '../../api/benhNhanApi';
import '../../styles/home/HoaDonModal.css';

interface HoaDonModalProps {
  danhSach: SanPhamTuiHang[];
  tongTien: number;
  onClose: () => void;
  onConfirm: (maBenhNhan: string | null) => void;
  loading: boolean;
}

const HoaDonModal: React.FC<HoaDonModalProps> = ({ danhSach, tongTien, onClose, onConfirm, loading }) => {
  const ngayTao = new Date().toLocaleString('vi-VN');

  // Dữ liệu cho Dropdown ngày tháng năm
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 1950 + i).reverse();

  // State form
  const [khachHang, setKhachHang] = useState({
    ten: '',
    sdt: '',
    diaChi: '',
    gioiTinh: 'Nam',
    ngay: '',
    thang: '',
    nam: ''
  });

  // [MỚI] State lưu ID khách hàng tìm thấy (để biết là khách cũ hay mới)
  const [foundId, setFoundId] = useState<string | null>(null);
  
  const [errMessage, setErrMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false); // Loading khi tìm kiếm

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setKhachHang({ ...khachHang, [e.target.name]: e.target.value });
  };

  // [MỚI] Hàm xử lý tìm kiếm SĐT
  const handleSearchPhone = async () => {
    if (!khachHang.sdt.trim()) {
      setErrMessage('Vui lòng nhập SĐT để tìm.');
      return;
    }
    setIsSearching(true);
    setErrMessage('');

    try {
      const res = await findPatientByPhone(khachHang.sdt);
      
      if (res.found && res.data) {
        // TÌM THẤY: Điền dữ liệu vào form
        const data = res.data;
        
        // Tách ngày sinh từ ISO string (YYYY-MM-DD...)
        let d = '', m = '', y = '';
        if (data.NgaySinh) {
          const dateObj = new Date(data.NgaySinh);
          d = dateObj.getDate().toString();
          m = (dateObj.getMonth() + 1).toString();
          y = dateObj.getFullYear().toString();
        }

        setKhachHang({
          ...khachHang,
          ten: data.TenBenhNhan,
          diaChi: data.DiaChi || '',
          gioiTinh: data.GioiTinh || 'Nam',
          ngay: d,
          thang: m,
          nam: y
        });
        setFoundId(data.MaBenhNhan); // Lưu lại ID
        setErrMessage('Đã tìm thấy thông tin khách hàng cũ!');
      } else {
        // KHÔNG TÌM THẤY: Reset form để nhập mới
        setFoundId(null);
        setKhachHang(prev => ({
          ...prev, 
          ten: '', diaChi: '', gioiTinh: 'Nam', ngay: '', thang: '', nam: ''
        }));
        setErrMessage('Khách hàng mới (SĐT chưa tồn tại). Vui lòng nhập thông tin.');
      }
    } catch (error) {
      console.error(error);
      setErrMessage('Lỗi kết nối server khi tìm kiếm.');
    } finally {
      setIsSearching(false);
    }
  };

  // Logic Lưu và Xác nhận
  const handleSaveAndConfirm = async () => {
    setErrMessage('');

    // 1. Khách vãng lai
    if (!khachHang.ten.trim() && !khachHang.sdt.trim()) {
      onConfirm(null);
      return;
    }

    // 2. Validate
    if (!khachHang.ten.trim() || !khachHang.sdt.trim()) {
      setErrMessage('Vui lòng nhập Tên và SĐT');
      return;
    }

    try {
      // Format ngày sinh YYYY-MM-DD
      let ngaySinhFormatted = '';
      if (khachHang.nam && khachHang.thang && khachHang.ngay) {
        const y = khachHang.nam;
        const m = String(khachHang.thang).padStart(2, '0');
        const d = String(khachHang.ngay).padStart(2, '0');
        ngaySinhFormatted = `${y}-${m}-${d}`;
      }

      const payload = {
        TenBenhNhan: khachHang.ten,
        SoDienThoai: khachHang.sdt,
        DiaChi: khachHang.diaChi,
        GioiTinh: khachHang.gioiTinh,
        NgaySinh: ngaySinhFormatted
      };

      if (foundId) {
        // [CASE 1] KHÁCH CŨ -> Cập nhật thông tin mới nhất
        await updatePatient(foundId, payload); 
        console.log("Cập nhật khách cũ:", foundId);
        onConfirm(foundId);
      } else {
        // [CASE 2] KHÁCH MỚI -> Thêm vào DB
        // Lưu ý: API addPatient cần bỏ check trùng SĐT nếu muốn cho phép
        // Nhưng ở đây luồng logic là: Tìm ko thấy -> Thêm mới -> Hợp lý.
        const newPatient = await addPatient(payload);
        console.log("Tạo khách mới:", newPatient.MaBenhNhan);
        onConfirm(newPatient.MaBenhNhan);
      }

    } catch (error: any) {
      console.error("Lỗi xử lý:", error);
      setErrMessage(error.message || 'Lỗi khi lưu thông tin khách hàng');
    }
  };

  return (
    <div className="hoadon-overlay">
      <div className="hoadon-container">
        {/* ... Header giữ nguyên ... */}
        <div className="hoadon-header">
          <h2>Nhà Thuốc SaTi</h2>
          <p>ĐC: 123 Nguyễn Trãi, Quận Thanh Xuân</p>
          <div className="dashed-line"></div>
          <h3>HÓA ĐƠN</h3>
          <p>{ngayTao}</p>
        </div>

        {/* --- FORM NHẬP KHÁCH HÀNG --- */}
        <div className="customer-input-group" style={{ textAlign: 'left', marginBottom: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
          <strong style={{ display: 'block', marginBottom: '8px', color: '#007bff' }}>Thông tin khách hàng:</strong>
          
          {/* [MỚI] Hàng 1: SĐT + Nút Tìm */}
          <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
            <input
              className="form-control" 
              placeholder="Nhập SĐT để tìm..."
              name="sdt" 
              value={khachHang.sdt} 
              onChange={handleInputChange}
              style={{ flex: 1, padding: '6px', border: '1px solid #ccc' }}
            />
            <button 
              onClick={handleSearchPhone}
              disabled={isSearching}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0 15px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isSearching ? '...' : 'Tìm'}
            </button>
          </div>

          {/* Hàng 2: Tên */}
          <div style={{ marginBottom: '8px' }}>
            <input
              className="form-control" placeholder="Tên khách hàng"
              name="ten" value={khachHang.ten} onChange={handleInputChange}
              style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Hàng 3: Giới tính & Ngày sinh (Giữ nguyên) */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
            <select className="form-control" name="gioiTinh" value={khachHang.gioiTinh} onChange={handleInputChange} style={{ flex: 1, padding: '6px' }}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            <div style={{ flex: 3, display: 'flex', gap: '5px' }}>
              <select name="ngay" className="form-control" value={khachHang.ngay} onChange={handleInputChange} style={{padding: '6px'}}>
                <option value="">Ngày</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select name="thang" className="form-control" value={khachHang.thang} onChange={handleInputChange} style={{padding: '6px'}}>
                <option value="">Tháng</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select name="nam" className="form-control" value={khachHang.nam} onChange={handleInputChange} style={{padding: '6px'}}>
                <option value="">Năm</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Hàng 4: Địa chỉ (Giữ nguyên) */}
          <input
            className="form-control" placeholder="Địa chỉ..."
            name="diaChi" value={khachHang.diaChi} onChange={handleInputChange}
            style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          />
          
          {/* Thông báo lỗi hoặc thành công */}
          {errMessage && (
            <p style={{ 
              color: foundId ? '#28a745' : '#dc3545', // Xanh nếu tìm thấy, Đỏ nếu lỗi/ko thấy
              marginTop: '5px', fontSize: '0.9em', fontWeight: 'bold' 
            }}>
              {errMessage}
            </p>
          )}
        </div>

        {/* ... Table và Footer giữ nguyên ... */}
        <table className="hoadon-table">
          <thead>
            <tr>
              <th>Tên thuốc</th>
              <th className="text-center">SL</th>
              <th className="text-right">Đ.Giá</th>
              <th className="text-right">T.Tiền</th>
            </tr>
          </thead>
          <tbody>
            {danhSach.map((item) => (
              <tr key={item.MaThuoc}>
                <td style={{ maxWidth: '140px' }}>{item.TenThuoc}</td>
                <td className="text-center">{item.soLuong}</td>
                <td className="text-right">{Number(item.GiaBan).toLocaleString('vi-VN')}</td>
                <td className="text-right">{Number(item.GiaBan * item.soLuong).toLocaleString('vi-VN')}</td>
              
              </tr>
            ))}
          </tbody>
        </table>

        <div className="hoadon-footer">
          <div className="dashed-line"></div>
          <div className="hoadon-row">
            <span>TỔNG CỘNG:</span>
<span>{Number(tongTien).toLocaleString('vi-VN')} VNĐ</span>          </div>
          <p className="loi-cam-on">Xin cảm ơn và hẹn gặp lại!</p>
        </div>

        <div className="hoadon-actions">
          <button className="btn-close" onClick={onClose} disabled={loading}>Đóng</button>
          <button className="btn-print" onClick={handleSaveAndConfirm} disabled={loading}>
            {loading ? "Đang xử lý..." : "Xuất hóa đơn"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoaDonModal;