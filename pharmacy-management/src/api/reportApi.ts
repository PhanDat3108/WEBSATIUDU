// src/api/reportApi.ts
import { BaoCaoTonKho } from '../interfaces';

/**
 * Lấy dữ liệu báo cáo tồn kho.
 * Khi BE chưa xong, nó trả về một đối tượng báo cáo rỗng.
 */
export const getBaoCaoTonKho = async (): Promise<BaoCaoTonKho> => {
  console.log('GỌI API: getBaoCaoTonKho (BE CHƯA SẴN SÀNG)');

  // Trả về một đối tượng báo cáo rỗng, đúng theo interface
  return Promise.resolve({
    TongSoLoaiThuoc: 0,
    TongSoLuongTon: 0,
    ThuocSapHetHan: [],
    ThuocDaHetHan: [],
    ThuocSapHetHang: [],
  });

  /* // --- KHI BE SẴN SÀNG ---
  try {
    const response = await fetch('/api/v1/reports/tonkho');
    if (!response.ok) {
      throw new Error('Lỗi khi tải báo cáo');
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi getBaoCaoTonKho:', error);
    throw error;
  }
  */
};
