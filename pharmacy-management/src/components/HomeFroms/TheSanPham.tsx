import React from "react";
import { useTuiHang } from "../../contexts/TuiHangContext";
import { Thuoc } from "../../interfaces";
// import "../../styles/home/TheSanPham.module.css"; // Kiểm tra lại đường dẫn CSS của bạn

interface TheSanPhamProps {
  sanPham: Thuoc;
}

const TheSanPham: React.FC<TheSanPhamProps> = ({ sanPham }) => {
  const { themVaoTuiHang } = useTuiHang();

  // [QUAN TRỌNG] Logic tự ghép tên file ảnh
  // Nếu mã là T001 -> Link sẽ là /images/thuoc/T001.jpg
  const imageUrl = `/images/thuoc/${sanPham.MaThuoc}.jpg`;

  // Hàm xử lý: Nếu không tìm thấy ảnh thuốc, dùng ảnh mặc định
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (!target.src.includes("default.png")) { // Tránh vòng lặp vô tận
        target.src = "/images/default.png"; // Bạn nhớ kiếm 1 cái ảnh default.png bỏ vào folder public/images nhé
    }
  };

  return (
    <div className="product-card" style={{border: '1px solid #eee', borderRadius: '8px', padding: '10px', margin: '10px', width: '200px'}}>
      {/* Vùng chứa ảnh */}
      <div className="product-image-container" style={{height: '180px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <img
          src={imageUrl}
          alt={sanPham.TenThuoc}
          onError={handleImageError}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            objectFit: 'contain' 
          }} 
        />
      </div>

      <div className="product-info" style={{marginTop: '10px'}}>
        <h3 style={{fontSize: '16px', height: '40px', overflow: 'hidden'}} title={sanPham.TenThuoc}>
          {sanPham.TenThuoc}
        </h3>
        
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px'}}>
            <span style={{color: '#d70018', fontWeight: 'bold'}}>
                {sanPham.GiaBan?.toLocaleString()} đ
            </span>
            {/* Nút thêm giỏ hàng */}
            <button 
                onClick={() => themVaoTuiHang(sanPham)}
                style={{
                    background: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer'
                }}
            >
                +
            </button>
        </div>
      </div>
    </div>
  );
};

export default TheSanPham;