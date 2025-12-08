import React from 'react';
import { Thuoc } from '../../interfaces';
import styles from '../../styles/home/TheSanPham.module.css';
import { useTuiHang } from "../../contexts/TuiHangContext";

// [QUAN TRỌNG] Định nghĩa Interface khớp với DanhSachSanPham
// Bên kia gọi sanPham={...} nên ở đây phải khai báo là sanPham
interface Props {
  sanPham: Thuoc;
}

const TheSanPham: React.FC<Props> = ({ sanPham }) => {
  const { themVaoTuiHang } = useTuiHang();

  // 1. Logic xử lý ảnh (Tự động lấy ảnh theo mã hoặc ảnh mặc định)
  // Nếu file ảnh chưa có, bạn có thể thay đường dẫn mặc định khác
  const imageUrl = `/images/thuoc/${sanPham.MaThuoc}.jpg`;
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Nếu lỗi ảnh, gán về ảnh mặc định (đảm bảo bạn có file này hoặc sửa link)
    e.currentTarget.src = "/images/default.png"; 
  };

  // 2. Logic xử lý Tồn kho (Từ API Backend gửi về)
  const tonKho = Number(sanPham.SoLuongTon || 0);
  const isHetHang = tonKho <= 0;

  return (
    <div className={styles.card} style={isHetHang ? { opacity: 0.6 } : {}}>
      
      {/* Badge thông báo Hết hàng đè lên ảnh */}
      {isHetHang && (
         <div style={{ 
             position: 'absolute', 
             top: '40%', left: '50%', transform: 'translate(-50%, -50%)', 
             zIndex: 10, 
             background: 'rgba(0,0,0,0.7)', color: '#fff', 
             padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px'
         }}>
            HẾT HÀNG
         </div>
      )}

      <div style={{ padding: 12, position: 'relative' }}>
        <img
          className={styles['card-image']}
          src={imageUrl}
          alt={sanPham.TenThuoc}
          onError={handleImageError}
          style={{ width: '100%', height: '150px', objectFit: 'contain' }}
        />
      </div>

      <div className={styles['card-body']}>
        <div>
          <h4 className={styles['card-title']} title={sanPham.TenThuoc} style={{
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {sanPham.TenThuoc}
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <div>
            <div className={styles['card-price']}>
    {Number(sanPham.GiaBan).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}₫
</div>
            
            {/* [MỚI] Dòng hiển thị số lượng tồn kho */}
            <div style={{ 
               fontSize: '12px', 
               fontWeight: '700',
               marginTop: '4px',
               color: isHetHang ? '#d9534f' : '#28a745' 
            }}>
              {isHetHang ? 'Tạm hết' : `Kho: ${tonKho}`}
            </div>
          </div>

          <button 
            className={styles['card-button']} 
            onClick={() => !isHetHang && themVaoTuiHang(sanPham)}
            title={isHetHang ? "Sản phẩm đã hết" : "Thêm vào giỏ"}
            disabled={isHetHang} 
            style={{
                
                cursor: isHetHang ? 'not-allowed' : 'pointer',
                backgroundColor: isHetHang ? '#ccc' : undefined
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