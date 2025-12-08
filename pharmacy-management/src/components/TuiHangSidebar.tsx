// src/components/TuiHangSidebar.tsx
import React, { useState } from 'react';
import { useTuiHang } from '../contexts/TuiHangContext';
// Import API vừa tạo ở trên
import { createDonThuoc, CreateDonThuocPayload } from '../api/donThuocApi'; 
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

  // Sự kiện mở Modal Hóa Đơn
  const handleXuatDonThuoc = () => {
    if (danhSachSanPham.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }
    setHienThiHoaDon(true);
  };

  // --- HÀM QUAN TRỌNG: Xử lý sau khi điền thông tin khách hàng ---
  const handleXacNhanLuu = async (maBenhNhan: string | null) => {
    try {
      setLoading(true);
      
      // 1. Lấy nhân viên (giả định)
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const maNhanVien = user?.MaNhanVien || "NV001"; 

      // 2. Chuẩn bị dữ liệu đúng form Backend yêu cầu
      const payload: CreateDonThuocPayload = {
        MaNhanVien: maNhanVien,
        MaBenhNhan: maBenhNhan, // Mã KH vừa tạo ở Modal (hoặc null)
        chiTiet: danhSachSanPham.map(sp => ({
          MaThuoc: sp.MaThuoc,
          SoLuong: sp.soLuong,
          GiaBan: sp.GiaBan
        }))
      };

      console.log("Đang gửi yêu cầu bán hàng...", payload);
      
      // 3. Gửi xuống Backend
      // Backend sẽ tự động: Tạo Mã PX -> Tạo Mã DT -> Trừ Kho -> Lưu DB
      const ketQua = await createDonThuoc(payload);

      // 4. Backend trả về thành công => Hiển thị mã
      const msg = `
      ✅ BÁN HÀNG THÀNH CÔNG!
      -------------------------
      Mã Đơn Thuốc: ${ketQua.MaDonThuoc}
      Mã Phiếu Xuất: ${ketQua.MaPhieuXuat}
      Tổng tiền:${Number(ketQua.TongTien).toLocaleString('vi-VN')} VNĐ
      `;
      alert(msg);
      
      // 5. In hóa đơn và dọn dẹp
      window.print();
      xoaTuiHang();
      setHienThiHoaDon(false);
      setMoRong(false);

    } catch (error: any) {
      console.error("Lỗi:", error);
      // Nếu lỗi (ví dụ hết hàng), hiển thị thông báo từ Backend
      alert(`❌ LỖI: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ... (Phần giao diện Sidebar giữ nguyên như cũ) ... */}
      {moRong && <div className="tui-hang-overlay" onClick={() => setMoRong(false)} />}
      
      <div className={`tui-hang-sidebar ${moRong ? 'mo-rong' : 'dong-gon'}`}>
        <div className="tui-hang-header">
            <h3> Đơn thuốc</h3>
            <button className="nut-dong" onClick={() => setMoRong(false)}>✕</button>
        </div>
        {/* Danh sách sản phẩm... */}
         {danhSachSanPham.length > 0 ? (
             <>
                <div className="tui-hang-danh-sach">
                 {danhSachSanPham.map((sanPham) => (
                    <div className="tui-hang-san-pham" key={sanPham.MaThuoc}>
                        <div className="san-pham-thong-tin">
                            <h4 className="san-pham-ten">{sanPham.TenThuoc}</h4>
                            <p className="san-pham-gia">{Number(sanPham.GiaBan).toLocaleString('vi-VN')}₫</p>
                        </div>
                        <div className="san-pham-so-luong">
                            <button className="nut-so-luong" onClick={() => capNhatSoLuong(sanPham.MaThuoc, sanPham.soLuong - 1)}>−</button>
                            <span className="so-luong-hien-thi">{sanPham.soLuong}</span>
                            <button className="nut-so-luong" onClick={() => capNhatSoLuong(sanPham.MaThuoc, sanPham.soLuong + 1)}>+</button>
                        </div>
                        <button className="nut-xoa" onClick={() => xoaKhoiTuiHang(sanPham.MaThuoc)}>✕</button>
                    </div>
                 ))}
                </div>
                <div className="tui-hang-footer">
                    <div className="tui-hang-tong-cong">
                        <strong>Tổng: {layTongTien().toLocaleString()}₫</strong>
                    </div>
                    <button className="nut-thanh-toan" onClick={handleXuatDonThuoc}>Xuất đơn thuốc</button>
                </div>
             </>
         ) : <div className="tui-hang-trong">Giỏ hàng trống</div>}
      </div>

      {/* Modal Hóa Đơn - Truyền hàm xử lý vào */}
      {hienThiHoaDon && (
        <HoaDonModal 
          danhSach={danhSachSanPham}
          tongTien={layTongTien()}
          onClose={() => setHienThiHoaDon(false)}
          onConfirm={handleXacNhanLuu} // <-- KẾT NỐI VÀO ĐÂY
          loading={loading}
        />
      )}
    </>
  );
};

export default TuiHangSidebar;