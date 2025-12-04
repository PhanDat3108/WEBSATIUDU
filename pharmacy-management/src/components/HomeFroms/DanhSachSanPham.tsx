import React, { useState, useEffect } from 'react';
import { Thuoc } from '../../interfaces'; 
// [QUAN TRỌNG] Import thêm các API mới
import { 
  getAllThuoc, // Đổi tên getMedicines thành getAllThuoc cho chuẩn (nếu chưa đổi thì dùng getMedicines)
  getHotProducts, 
  getNewProducts, 
  getFreeProducts,
  getThuocByCategory 
} from '../../api/thuocApi'; 

import TheSanPham from './TheSanPham'; 
import styles from '../../styles/home/DanhSachSanPham.module.css'; 

interface Props {
  maLoai?: string;       // Có thể là 'HOT', 'NEW', 'FREE' hoặc mã loại thuốc 'LT01'...
  tenLoai?: string;
  searchKeyword?: string;
}

const DanhSachSanPham: React.FC<Props> = ({ maLoai, tenLoai, searchKeyword }) => {
  const [thuocList, setThuocList] = useState<Thuoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // [MỚI] Hàm xử lý logic tiêu đề
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

        // --- LOGIC GỌI API TÙY VÀO PROPS ---
        
        // 1. Ưu tiên tìm kiếm (Nếu có từ khóa)
       if (searchKeyword) {
    // Nếu bạn chưa có API tìm kiếm riêng, thì gọi tất cả rồi lọc
    const all = await getAllThuoc();
    
    // [SỬA LỖI TẠI ĐÂY]: Thêm kiểu dữ liệu (t: Thuoc)
    data = all.filter((t: Thuoc) => 
        t.TenThuoc.toLowerCase().includes(searchKeyword.toLowerCase())
    );
}
        // 2. Nếu là các Mã Đặc Biệt (HOT, NEW, FREE)
        else if (maLoai === 'HOT') {
          data = await getHotProducts();
        } 
        else if (maLoai === 'NEW') {
          data = await getNewProducts();
        } 
        else if (maLoai === 'FREE') {
          data = await getFreeProducts();
        }
        // 3. Nếu là Mã Danh Mục thường (VD: LT001)
        else if (maLoai) {
          // Đảm bảo bạn đã viết hàm này trong api/thuocApi.ts
          data = await getThuocByCategory(maLoai);
        }
        // 4. Mặc định: Lấy tất cả
        else {
          data = await getAllThuoc();
        }

        setThuocList(data);
      } catch (error) {
        console.error(error);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maLoai, searchKeyword]); // [QUAN TRỌNG] Chạy lại khi props thay đổi

  // --- RENDER ---
  if (loading) return <div className={styles['message']}>Đang tải sản phẩm...</div>;
  if (error) return <div className={styles['messageError']}>{error}</div>;

  return (
    <>
      {/* Hiển thị tiêu đề động */}
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