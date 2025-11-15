// src/components/TheSanPham.tsx
import React from 'react';
import { Thuoc } from '../../interfaces';
import styles from '../../styles/home/TheSanPham.module.css';
import { useTuiHang } from '../../contexts/TuiHangContext';

interface Props {
  thuoc: Thuoc;
}

const TheSanPham: React.FC<Props> = ({ thuoc }) => {
  // LƯU Ý: Chúng ta sẽ tạm thời dùng ảnh placeholder.
  // Bạn sẽ cần thêm trường HinhAnh vào interface và database sau này.
  const imageUrl = "https://via.placeholder.com/400x400?text=" + encodeURIComponent(thuoc.TenThuoc);
  const { themVaoTuiHang } = useTuiHang();

  return (
    <div className={styles['card']} style={{ position: 'relative' }}>
      <img src={imageUrl} alt={thuoc.TenThuoc} className={styles['card-image']} />
      <div className={styles['card-body']}>
        <h3 className={styles['card-title']}>{thuoc.TenThuoc}</h3>
        <p className={styles['card-price']}>
          {Number(thuoc.GiaBan || 0).toLocaleString('vi-VN')}₫
        </p>
        <button
          className={styles['card-button']}
          onClick={() => themVaoTuiHang(thuoc, 1)}
          aria-label={`Thêm ${thuoc.TenThuoc} vào giỏ`}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default TheSanPham; 