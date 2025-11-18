// src/components/HoaDonModal.tsx
import React from 'react';
import { SanPhamTuiHang } from '../../contexts/TuiHangContext';
import '../../styles/home/HoaDonModal.css';

interface HoaDonModalProps {
  danhSach: SanPhamTuiHang[];
  tongTien: number;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const HoaDonModal: React.FC<HoaDonModalProps> = ({ danhSach, tongTien, onClose, onConfirm, loading }) => {
  const ngayTao = new Date().toLocaleString('vi-VN');

  return (
    <div className="hoadon-overlay">
      <div className="hoadon-container">
        <div className="hoadon-header">
          <h2>Nhà Thuốc Websatiudu</h2>
          <p>ĐC: 123 Đường ABC, Quận XYZ</p>
          <p>SĐT: 0909.123.456</p>
          <div className="dashed-line"></div>
          <h3>HÓA ĐƠN BÁN LẺ</h3>
          <p>{ngayTao}</p>
        </div>

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
                <td style={{maxWidth: '120px'}}>{item.TenThuoc}</td>
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
          <button className="btn-print" onClick={onConfirm} disabled={loading}>
            {loading ? "Đang lưu..." : "🖨️ In & Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoaDonModal;