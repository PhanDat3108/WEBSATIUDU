// src/api/revenueApi.ts
import { DuLieuDoanhThu } from '../interfaces';

export const getRevenueData = async (): Promise<DuLieuDoanhThu[]> => {
  console.log('GỌI API: getRevenueData (BE CHƯA SẴN SÀNG)');
  
  // Trả về mảng rỗng
  return Promise.resolve([]);

  /* // --- KHI BE SẴN SÀNG ---
  // try {
  //   const response = await fetch('/api/v1/reports/revenue');
  //   if (!response.ok) {
  //     throw new Error('Lỗi khi tải dữ liệu doanh thu');
  //   }
  //   return await response.json();
  // } catch (error) {
  //   console.error('Lỗi getRevenueData:', error);
  //   throw error;
  // }
  */
};