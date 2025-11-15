import React from 'react';
import { Thuoc } from '../interfaces';
import styles from '../styles/home/TheSanPham.module.css';

interface Props {
  product: Thuoc;
  onAdd: (product: Thuoc) => void;
}

const TheSanPham: React.FC<Props> = ({ product, onAdd }) => {
  const placeholder = `https://via.placeholder.com/400x400?text=${encodeURIComponent(
    product.TenThuoc || 'Sản phẩm'
  )}`;
  const imgSrc = product.HinhAnh && product.HinhAnh.trim() !== '' ? product.HinhAnh : placeholder;
  const discount = product.GiaNhap && product.GiaBan && product.GiaNhap > product.GiaBan
    ? Math.round(((product.GiaNhap - product.GiaBan) / product.GiaNhap) * 100)
    : 0;

  return (
    <div className={styles.card}>
      {discount > 0 && (
        <div style={{ position: 'absolute', margin: 12 }}>
          <div style={{ background: '#d9534f', color: '#fff', padding: '6px 8px', borderRadius: 6, fontWeight: 700 }}>
            -{discount}%
          </div>
        </div>
      )}

      <div style={{ padding: 12 }}>
        <img
          className={styles['card-image']}
          src={imgSrc}
          alt={product.TenThuoc}
          onError={(e) => ((e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Sản+phẩm')}
        />
      </div>

      <div className={styles['card-body']}>
        <div>
          <h4 className={styles['card-title']}>{product.TenThuoc}</h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className={styles['card-price']}>{product.GiaBan?.toLocaleString()}₫</div>
            {product.GiaNhap && product.GiaNhap > product.GiaBan && (
              <div style={{ textDecoration: 'line-through', color: '#999', fontSize: 12 }}>{product.GiaNhap?.toLocaleString()}₫</div>
            )}
          </div>

          <button className={styles['card-button']} onClick={() => onAdd(product)} title="Thêm vào giỏ">
            🛒
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheSanPham;
