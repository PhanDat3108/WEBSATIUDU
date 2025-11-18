// src/api/reportApi.ts
import { BaoCaoTonKho } from '../interfaces';

export interface ExpiryStatusData {
  BinhThuong: number;
  SapHetHan: number;
  DaHetHan: number;
}

// [ĐÃ SỬA] Gọi API thật từ Backend
export const getBaoCaoTonKho = async (): Promise<BaoCaoTonKho> => {
  const response = await fetch('/api/v1/reports/tonkho');
  if (!response.ok) {
    throw new Error('Lỗi khi tải báo cáo tồn kho');
  }
  return await response.json();
};

// [ĐÃ SỬA] Gọi API thật từ Backend
export const getExpiryChartData = async (): Promise<ExpiryStatusData> => {
  const response = await fetch('/api/v1/reports/expiry-status');
  if (!response.ok) {
    throw new Error('Lỗi khi tải dữ liệu biểu đồ');
  }
  return await response.json();
};