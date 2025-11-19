// src/components/TuiHangSidebar.tsx
import React, { useState } from 'react';
import { useTuiHang } from '../contexts/TuiHangContext';
import { phieuXuatApi} from '../api/phieuXuatApi'; 
import {PhieuXuatPayload } from '../interfaces/index';
import HoaDonModal from '../components/HomeFroms/HoaDonModal';
import './TuiHangSidebar.css';

const TuiHangSidebar: React.FC = () => {
  const { 
    danhSachSanPham, 
    xoaKhoiTuiHang, 
    capNhatSoLuong, 
    layTongTien, 
    moRong, 
    setMoRong,
    xoaTuiHang 
  } = useTuiHang();

  const [hienThiHoaDon, setHienThiHoaDon] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Sự kiện bấm nút "Xuất đơn thuốc"
  const handleXuatDonThuoc = () => {
    if (danhSachSanPham.length === 0) {
      alert("Giỏ hàng đang trống, không thể xuất đơn!");
      return;
    }
    // Hiển thị bảng hóa đơn để xem trước
    setHienThiHoaDon(true);
  };

  // 2. Sự kiện bấm "In & Lưu" trên Hóa đơn
  const handleXacNhanLuu = async () => {
    try {
      setLoading(true);
      
      // Lấy thông tin nhân viên đang đăng nhập (nếu có lưu trong localStorage)
      // Nếu chưa làm chức năng login hoàn chỉnh, tạm thời dùng "NV001"
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const maNhanVien = user?.MaNhanVien || "NV001"; 

      // Chuẩn bị dữ liệu đúng chuẩn Backend yêu cầu
      const payload: PhieuXuatPayload = {
        MaNhanVien: maNhanVien,
        LoaiXuat: "BanLe", // Có thể thay đổi tùy nghiệp vụ
        TongTien: layTongTien(),
        chiTiet: danhSachSanPham.map(sp => ({
          MaThuoc: sp.MaThuoc,
          SoLuongXuat: sp.soLuong,
          DonGiaXuat: sp.GiaBan
        }))
      };

      // Gọi API
      console.log("Đang gửi dữ liệu:", payload);
      await phieuXuatApi.create(payload);

      // Thành công
      alert("✅ Xuất đơn thuốc thành công!");
      
      // Lệnh in của trình duyệt
      window.print();

      // Reset giỏ hàng và đóng modal
      xoaTuiHang();
      setHienThiHoaDon(false);
      setMoRong(false);

    } catch (error: any) {
      console.error("Lỗi xuất đơn:", error);
      alert("❌ Lỗi: " + (error.message || "Không thể lưu đơn thuốc"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay che màn hình khi sidebar mở */}
      {moRong && <div className="tui-hang-overlay" onClick={() => setMoRong(false)} />}

      {/* Sidebar Giỏ hàng */}
      <div className={`tui-hang-sidebar ${moRong ? 'mo-rong' : 'dong-gon'}`}>
        <div className="tui-hang-header">
          <h3>🛒 Đơn thuốc</h3>
          <button className="nut-dong" onClick={() => setMoRong(false)}>✕</button>
        </div>

        {danhSachSanPham.length === 0 ? (
          <div className="tui-hang-trong">Chưa có thuốc nào</div>
        ) : (
          <>
            <div className="tui-hang-danh-sach">
              {danhSachSanPham.map((sanPham) => (
                <div className="tui-hang-san-pham" key={sanPham.MaThuoc}>
                  <div className="san-pham-thong-tin">
                    <h4 className="san-pham-ten">{sanPham.TenThuoc}</h4>
                    <p className="san-pham-gia">{sanPham.GiaBan?.toLocaleString()}₫</p>
                  </div>
                  <div className="san-pham-so-luong">
                    <button className="nut-so-luong" onClick={() => capNhatSoLuong(sanPham.MaThuoc, sanPham.soLuong - 1)}>−</button>
                    <input 
                      type="number" 
                      className="nhap-so-luong"
                      value={sanPham.soLuong} 
                      onChange={(e) => capNhatSoLuong(sanPham.MaThuoc, parseInt(e.target.value) || 1)}
                    />
                    <button className="nut-so-luong" onClick={() => capNhatSoLuong(sanPham.MaThuoc, sanPham.soLuong + 1)}>+</button>
                  </div>
                  <div className="san-pham-tong-tien">
                    {(sanPham.GiaBan * sanPham.soLuong).toLocaleString()}₫
                  </div>
                  <button className="nut-xoa" onClick={() => xoaKhoiTuiHang(sanPham.MaThuoc)}>✕</button>
                </div>
              ))}
            </div>

            <div className="tui-hang-footer">
              <div className="tui-hang-tong-cong">
                <strong>Tổng cộng:</strong>
                <span className="gia-tong">{layTongTien().toLocaleString()}₫</span>
              </div>
              {/* Nút Xuất đơn thuốc */}
              <button className="nut-thanh-toan" onClick={handleXuatDonThuoc}>
                Xuất đơn thuốc
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal Hóa Đơn */}
      {hienThiHoaDon && (
        <HoaDonModal 
          danhSach={danhSachSanPham}
          tongTien={layTongTien()}
          onClose={() => setHienThiHoaDon(false)}
          onConfirm={handleXacNhanLuu}
          loading={loading}
        />
      )}
    </>
  );
};

export default TuiHangSidebar;