// Định nghĩa cấu trúc dữ liệu Medicine
// Dùng chung cho Mock data và Form
export interface Medicine {
  id: number;
  stt: number;
  maThuoc: string;
  tenThuoc: string;
  loaiThuoc: string;
  soLuong: number;
  hsd: string;        // Định dạng: YYYY-MM-DD
  nhaCungCap: string; // Thêm từ form
  ngayNhap: string;   // Thêm từ form (YYYY-MM-DD)
}