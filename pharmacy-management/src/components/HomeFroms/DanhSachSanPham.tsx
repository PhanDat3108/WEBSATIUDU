// src/components/HomeFroms/DanhSachSanPham.tsx
import React, { useState, useEffect } from 'react';
import { Thuoc } from '../../interfaces'; 
import { getMedicines } from '../../api/thuocApi'; 
import TheSanPham from './TheSanPham'; 
import styles from '../../styles/home/DanhSachSanPham.module.css'; 

const DanhSachSanPham: React.FC = () => {
  const [thuocList, setThuocList] = useState<Thuoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThuoc = async () => {
      try {
        setLoading(true);
        const data = await getMedicines(); //
        setThuocList(data);
        setError(null);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thuốc:", error);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchThuoc();
  }, []); 

  if (loading) {
    return <div className={styles['message']}>Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div className={styles['messageError']}>{error}</div>;
  }

  return (
    <div className={styles['product-list-grid']}>
      {thuocList.map(thuoc => (
        <TheSanPham key={thuoc.MaThuoc} thuoc={thuoc} />
      ))}
    </div>
  );
};

export default DanhSachSanPham;