// src/components/HomeFroms/HoaDonModal.tsx
import React, { useState } from 'react';
import { SanPhamTuiHang } from '../../contexts/TuiHangContext';
import { addPatient } from '../../api/benhNhanApi';
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

  // Tạo danh sách lựa chọn cho Ngày, Tháng, Năm
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  // Năm từ 1950 đến 2025, đảo ngược để năm mới nhất lên đầu
  const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 1950 + i).reverse();

  // State lưu thông tin khách hàng
  const [khachHang, setKhachHang] = useState({
    ten: '',
    sdt: '',
    diaChi: '',
    gioiTinh: 'Nam', // Mặc định là Nam
    ngay: '',
    thang: '',
    nam: ''
  });
  
  const [errMessage, setErrMessage] = useState('');

  // Xử lý thay đổi input (Text & Select)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setKhachHang({ ...khachHang, [e.target.name]: e.target.value });
  };

  // Logic xử lý chính: Lưu KH -> Lấy ID -> Confirm
  const handleSaveAndConfirm = async () => {
    setErrMessage('');

    // 1. Nếu KHÔNG nhập gì => Khách vãng lai (MaBenhNhan = null)
    if (!khachHang.ten.trim() && !khachHang.sdt.trim()) {
      onConfirm(null);
      return;
    }

    // 2. Validate cơ bản
    if (!khachHang.ten.trim() || !khachHang.sdt.trim()) {
      setErrMessage('Vui lòng nhập Tên và SĐT (hoặc để trống cả hai nếu là khách vãng lai)');
      return;
    }

    try {
      // Xử lý ngày sinh: Ghép chuỗi YYYY-MM-DD (Chuẩn Database)
      let ngaySinhFormatted = '';
      if (khachHang.nam && khachHang.thang && khachHang.ngay) {
        const y = khachHang.nam;
        const m = String(khachHang.thang).padStart(2, '0');
        const d = String(khachHang.ngay).padStart(2, '0');
        ngaySinhFormatted = `${y}-${m}-${d}`;
      }

      // 3. Gọi API tạo bệnh nhân mới
      const newPatient = await addPatient({
        TenBenhNhan: khachHang.ten,
        SoDienThoai: khachHang.sdt,
        DiaChi: khachHang.diaChi,
        GioiTinh: khachHang.gioiTinh, // Lấy từ dropdown
        NgaySinh: ngaySinhFormatted   // Gửi ngày đã format hoặc chuỗi rỗng
      });

      // 4. Có ID rồi -> Gửi sang cha
      console.log("Đã tạo khách hàng:", newPatient.MaBenhNhan);
      onConfirm(newPatient.MaBenhNhan);

    } catch (error: any) {
      console.error("Lỗi lưu khách hàng:", error);
      setErrMessage(error.message || 'Lỗi khi lưu thông tin khách hàng');
    }
  };

  return (
    <div className="hoadon-overlay">
      <div className="hoadon-container">
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
          
          {/* Hàng 1: Tên và SĐT */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
            <input
              className="form-control" placeholder="Tên khách hàng"
              name="ten" value={khachHang.ten} onChange={handleInputChange}
              style={{ flex: 2, padding: '6px' }}
            />
            <input
              className="form-control" placeholder="Số điện thoại"
              name="sdt" value={khachHang.sdt} onChange={handleInputChange}
              style={{ flex: 1, padding: '6px' }}
            />
          </div>

          {/* Hàng 2: Giới tính và Ngày Sinh */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
            {/* Giới Tính */}
            <select 
              className="form-control" 
              name="gioiTinh" 
              value={khachHang.gioiTinh} 
              onChange={handleInputChange}
              style={{ flex: 1, padding: '6px' }}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>

            {/* Ngày Sinh (3 Select box) */}
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

          {/* Hàng 3: Địa chỉ */}
          <input
            className="form-control" placeholder="Địa chỉ (Số nhà, đường, phường/xã...)"
            name="diaChi" value={khachHang.diaChi} onChange={handleInputChange}
            style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          />
          
          {errMessage && <p style={{ color: 'red', marginTop: '5px', fontSize: '0.9em', fontWeight: 'bold' }}>{errMessage}</p>}
        </div>
        {/* ----------------------------- */}

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
                <td className="text-right">{item.GiaBan.toLocaleString()}</td>
                <td className="text-right">{(item.GiaBan * item.soLuong).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="hoadon-footer">
          <div className="dashed-line"></div>
          <div className="hoadon-row">
            <span>TỔNG CỘNG:</span>
            <span>{tongTien.toLocaleString()} VNĐ</span>
          </div>
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