import React from 'react';
import { useTuiHang } from '../contexts/TuiHangContext';
import './TuiHangSidebar.css';

const TuiHangSidebar: React.FC = () => {
  const { danhSachSanPham, xoaKhoiTuiHang, capNhatSoLuong, layTongTien, moRong, setMoRong } = useTuiHang();

  return (
    <>
      {/* Overlay khi sidebar mở - để đóng sidebar */}
      {moRong && (
        <div 
          className="tui-hang-overlay"
          onClick={() => setMoRong(false)}
        />
      )}

      {/* Sidebar slide in/out */}
      <div className={`tui-hang-sidebar ${moRong ? 'mo-rong' : 'dong-gon'}`}>
        <div className="tui-hang-header">
          <h3>🛒 Đơn thuốc</h3>
          <button
            className="nut-dong"
            onClick={() => setMoRong(false)}
            title="Đóng"
          >
            ✕
          </button>
        </div>

        {danhSachSanPham.length === 0 ? (
          <div className="tui-hang-trong">Giỏ hàng trống</div>
        ) : (
          <>
            <div className="tui-hang-danh-sach">
              {danhSachSanPham.map((sanPham: any) => (
                <div className="tui-hang-san-pham" key={sanPham.MaThuoc}>
                  <div className="san-pham-thong-tin">
                    <h4 className="san-pham-ten">{sanPham.TenThuoc}</h4>
                    <p className="san-pham-gia">{sanPham.GiaBan?.toLocaleString()}₫</p>
                  </div>

                  <div className="san-pham-so-luong">
                    <button
                      className="nut-so-luong"
                      onClick={() => capNhatSoLuong(sanPham.MaThuoc, sanPham.soLuong - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="nhap-so-luong"
                      value={sanPham.soLuong}
                      onChange={(e) => {
                        const soLuongMoi = parseInt(e.target.value) || 1;
                        capNhatSoLuong(sanPham.MaThuoc, soLuongMoi);
                      }}
                      min="1"
                    />
                    <button
                      className="nut-so-luong"
                      onClick={() => capNhatSoLuong(sanPham.MaThuoc, sanPham.soLuong + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="san-pham-tong-tien">
                    {(sanPham.GiaBan * sanPham.soLuong).toLocaleString()}₫
                  </div>

                  <button
                    className="nut-xoa"
                    onClick={() => xoaKhoiTuiHang(sanPham.MaThuoc)}
                    title="Xóa"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="tui-hang-footer">
              <div className="tui-hang-tong-cong">
                <strong>Tổng cộng:</strong>
                <span className="gia-tong">{layTongTien().toLocaleString()}₫</span>
              </div>
              <button className="nut-thanh-toan">Thanh toán</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TuiHangSidebar;
