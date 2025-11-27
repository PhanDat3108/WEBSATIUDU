// src/api/revenueApi.ts
import axios from "axios"; // <--- BẮT BUỘC PHẢI CÓ DÒNG NÀY

// Lưu ý: Port 5000 là port mặc định của Backend Node.js bạn đã cấu hình
// Nếu backend chạy port khác (ví dụ 8080), hãy sửa số 5000 thành 8080
const API_URL = "http://localhost:8080/api/v1/revenue";

export const getRevenueStats = async (month?: number, year?: number) => {
  // Tạo object params để axios tự chuyển thành ?month=...&year=...
  const params: any = {};
  if (month) params.month = month;
  if (year) params.year = year;

  const response = await axios.get(`${API_URL}/stats`, { params });
  return response.data;
};