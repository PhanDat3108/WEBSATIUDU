// src/api/phieuXuatApi.ts
import { PhieuXuat } from '../interfaces';

const API_BASE_URL = '/api/v1/phieuxuat';

export const getPhieuXuats = async (): Promise<PhieuXuat[]> => {
  console.log('GỌI API: getPhieuXuats (BE CHƯA SẴN SÀNG)');
  return Promise.resolve([]);
};

// Thêm một export rỗng để file này được coi là một module
export {};