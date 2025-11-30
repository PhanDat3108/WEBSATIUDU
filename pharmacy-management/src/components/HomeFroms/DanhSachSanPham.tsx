import React, { useState, useEffect } from 'react';
import { Thuoc } from '../../interfaces'; 
import { getMedicines } from '../../api/thuocApi'; 
import TheSanPham from './TheSanPham'; 
import styles from '../../styles/home/DanhSachSanPham.module.css'; 

interface Props {
  maLoai?: string;
  tenLoai?: string;
  searchKeyword?: string; // [MỚI] Nhận từ khóa tìm kiếm
}

const DanhSachSanPham: React.FC<Props> = ({ maLoai, tenLoai, searchKeyword }) => {
  const [thuocList, setThuocList] = useState<Thuoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThuoc = async () => {
      try {
        setLoading(true);
        const data = await getMedicines(); 
        setThuocList(data);
      } catch (error) {
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchThuoc();
  }, []); 

  // --- LOGIC LỌC SẢN PHẨM ---
  let displayList = thuocList;
  let title = ""; // Biến để hiển thị tiêu đề động

  if (maLoai) {
    // 1. Nếu đang chọn danh mục (Hoặc tìm kiếm đúng tên danh mục)
    displayList = thuocList.filter(t => t.MaLoai === maLoai);
    title = `Loại thuốc: ${tenLoai}`;
  } else if (searchKeyword) {
    // 2. Nếu đang tìm kiếm theo tên thuốc (gõ 1 nửa hoặc đầy đủ)
    const lowerKeyword = searchKeyword.toLowerCase();
    displayList = thuocList.filter(t => 
      t.TenThuoc.toLowerCase().includes(lowerKeyword)
    );
    title = `Kết quả tìm kiếm: "${searchKeyword}"`;
  }

  if (loading) return <div className={styles['message']}>Đang tải sản phẩm...</div>;
  if (error) return <div className={styles['messageError']}>{error}</div>;

  return (
    <>
      {/* Hiển thị tiêu đề nếu có (khi lọc hoặc tìm kiếm) */}
      {(maLoai || searchKeyword) && (
        <h2 style={{ 
          padding: '20px 20px 10px 20px', 
          color: '#333', 
          fontSize: '24px',
          fontWeight: 'bold',
          textTransform: 'capitalize' 
        }}>
          {title}
        </h2>
      )}
      
      <div className={styles['product-list-grid']}>
        {displayList.length > 0 ? (
          displayList.map(thuoc => (
            <TheSanPham key={thuoc.MaThuoc} sanPham={thuoc} />
          ))
        ) : (
          <div style={{ 
            padding: '40px 20px', gridColumn: '1/-1', textAlign: 'center',
            color: '#555', fontSize: '20px', fontWeight: 'bold',
            display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px'
          }}>
            {/* Thông báo linh hoạt */}
            Không tìm thấy thuốc nào {maLoai ? `thuộc loại "${tenLoai}"` : `phù hợp với từ khóa "${searchKeyword}"`}.
          </div>
        )}
      </div>
    </>
  );
};

export default DanhSachSanPham;