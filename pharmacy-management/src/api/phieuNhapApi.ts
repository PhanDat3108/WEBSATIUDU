// src/api/phieuNhapApi.ts
import { PhieuNhap } from '../interfaces';

const API_BASE_URL = '/api/v1/phieunhap';

export const getPhieuNhaps = async (): Promise<PhieuNhap[]> => {
  console.log('GỌI API: getPhieuNhaps (BE CHƯA SẴN SÀNG)');
  return Promise.resolve([]);
};

// Thêm một export rỗng để file này được coi là một module
export {};