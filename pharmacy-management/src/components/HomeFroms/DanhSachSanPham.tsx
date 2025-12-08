import React, { useState, useEffect } from 'react';
import { Thuoc } from '../../interfaces'; 
// Import các API
import { 
  getAllThuoc, 
  getHotProducts, 
  getNewProducts, 
  getFreeProducts,
  getThuocByCategory 
} from '../../api/thuocApi'; 

import TheSanPham from './TheSanPham'; 
import styles from '../../styles/home/DanhSachSanPham.module.css'; 

interface Props {
  maLoai?: string;      
  tenLoai?: string;
  searchKeyword?: string;
}

const DanhSachSanPham: React.FC<Props> = ({ maLoai, tenLoai, searchKeyword }) => {
  const [thuocList, setThuocList] = useState<Thuoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm xử lý logic tiêu đề
  const getTitle = () => {
    if (searchKeyword) return `🔍 Kết quả tìm kiếm: "${searchKeyword}"`;
    if (maLoai === 'HOT') return '🔥 Sản phẩm Bán Chạy';
    if (maLoai === 'NEW') return '✨ Sản phẩm Mới Về';
    if (maLoai === 'FREE') return '🎁 Quà Tặng (0 Đồng)';
    if (tenLoai) return `Danh mục: ${tenLoai}`;
    return 'Tất cả sản phẩm';
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Thuoc[] = [];

        // --- LOGIC GỌI API ---
        
        // 1. Ưu tiên tìm kiếm
        if (searchKeyword) {
            const all = await getAllThuoc();
            // Lọc theo từ khóa tìm kiếm trước
            data = all.filter((t: Thuoc) => 
                t.TenThuoc.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }
        // 2. Nếu là các Mã Đặc Biệt
        else if (maLoai === 'HOT') {
          data = await getHotProducts();
        } 
        else if (maLoai === 'NEW') {
          data = await getNewProducts();
        } 
        else if (maLoai === 'FREE') {
          data = await getFreeProducts();
        }
        // 3. Nếu là Mã Danh Mục thường
        else if (maLoai) {
          data = await getThuocByCategory(maLoai);
        }
        // 4. Mặc định: Lấy tất cả
        else {
          data = await getAllThuoc();
        }

        // =========================================================
        // [QUAN TRỌNG - PHẦN SỬA ĐỔI]
        // Lọc bỏ thuốc ngưng kinh doanh (Discontinued) ở bước cuối cùng
        // để áp dụng cho TẤT CẢ các trường hợp (Search, Hot, New, Danh mục...)
        // =========================================================
        const activeProducts = data.filter((t: Thuoc) => 
          !t.TenThuoc.toLowerCase().includes('(discontinued)')
        );

        setThuocList(activeProducts);

      } catch (error) {
        console.error(error);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maLoai, searchKeyword]); 

  // --- RENDER ---
  if (loading) return <div className={styles['message']}>Đang tải sản phẩm...</div>;
  if (error) return <div className={styles['messageError']}>{error}</div>;

  return (
    <>
      <h2 style={{ 
        padding: '20px 20px 10px 20px', 
        color: '#007bff', 
        fontSize: '24px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center'
      }}>
        {getTitle()}
      </h2>
      
      <div className={styles['product-list-grid']}>
        {thuocList.length > 0 ? (
          thuocList.map(thuoc => (
            <TheSanPham key={thuoc.MaThuoc} sanPham={thuoc} />
          ))
        ) : (
          <div style={{ 
            padding: '40px 20px', gridColumn: '1/-1', textAlign: 'center',
            color: '#555', fontSize: '18px', minHeight: '200px'
          }}>
             Không tìm thấy sản phẩm nào phù hợp.
          </div>
        )}
      </div>
    </>
  );
};

export default DanhSachSanPham;