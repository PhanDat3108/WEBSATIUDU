// src/api/dashboardApi.ts
import { ThuocCanhBao } from '../interfaces';

// Hàm này sẽ lấy các thuốc sắp hết hạn hoặc sắp hết hàng
export const getWarningMedicines = async (): Promise<ThuocCanhBao[]> => {
  console.log('GỌI API: getWarningMedicines (BE CHƯA SẴN SÀNG)');
  
  // Trả về mảng rỗng
  return Promise.resolve([]);

  /* // --- KHI BE SẴN SÀNG ---
  // try {
  //   const response = await fetch('/api/v1/dashboard/warnings');
  //   if (!response.ok) {
  //     throw new Error('Lỗi khi tải dữ liệu cảnh báo');
  //   }
  //   return await response.json();
  // } catch (error) {
  //   console.error('Lỗi getWarningMedicines:', error);
  //   throw error;
  // }
  */
};