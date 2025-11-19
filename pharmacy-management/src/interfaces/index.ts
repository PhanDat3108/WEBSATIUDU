// src/interfaces/index.ts
// Các interface được thiết kế lại theo file 'database-sau-sửa.docx' và chuẩn PascalCase

// === CÁC THỰC THỂ CHÍNH ===

/**
 * 1.1. Thuốc (Medicine)
 * Lưu ý: Đã loại bỏ NgayNhap và HanSuDung khỏi bảng chính.
 */
export interface Thuoc {
  MaThuoc: string;
  TenThuoc: string;
  DonViTinh: string;
  SoLuongTon: number;
  GiaNhap: number;
  GiaBan: number;
  MaNhaCungCap: string; // Khóa ngoại
  MaLoai: string; // Khóa ngoại

  // Dữ liệu join từ BE (Rất hữu ích để hiển thị)
  TenLoai?: string;
  TenNhaCungCap?: string;
  // URL ảnh đại diện cho thuốc (nếu có)
  HinhAnh?: string;
}

/**
 * 1.2. Loại thuốc (LoaiThuoc)
 */
export interface LoaiThuoc {
  MaLoai: string;
  TenLoai: string;
}

/**
 * 1.3. Nhà cung cấp (NhaCungCap)
 */
export interface NhaCungCap {
  MaNhaCungCap: string;
  TenNhaCungCap: string;
  DiaChi: string;
  SoDienThoai: string;
  Email: string;
}

/**
 * 1.4. Phiếu nhập (PhieuNhap)
 */
export interface PhieuNhap {
  MaPhieuNhap: string;
  NgayNhap: string; // Nên dùng string (ISO 8601) hoặc Date
  TongTien: number;
  MaNhaCungCap: string; // Khóa ngoại
  MaNhanVien: string; // Khóa ngoại

  // Dữ liệu lồng
  ChiTietNhap?: ChiTietNhap[];
}

/**
 * 1.5. Chi tiết phiếu nhập (ChiTietNhap)
 * [BỔ SUNG] Thêm HanSuDung.
 */
export interface ChiTietNhap {
  MaPhieuNhap: string;
  MaThuoc: string;
  SoLuongNhap: number;
  DonGiaNhap: number;
  HanSuDung: string; // [MỚI]

  // Dữ liệu join từ BE
  TenThuoc?: string;
}
export interface ChiTietNhapLichSu {
  MaPhieuNhap: string;
  NgayNhap: string;      
  TenThuoc: string;
  TenNhaCungCap: string;
  SoLuongNhap: number;
  DonGiaNhap: number;
  HanSuDung: string; 
SoLuongConLai: number;  }
  export interface ChiTietNhapCreate {
  MaThuoc: string;
  SoLuongNhap: number;
  DonGiaNhap: number;
  HanSuDung: string; 

}

export interface PhieuNhapCreatePayload {
  MaNhaCungCap: string;
  MaNhanVien: string;
  chiTiet: ChiTietNhapCreate[];
}
/**
 * 1.6. Phiếu xuất (PhieuXuat)
 * [BỔ SUNG] Thêm LoaiXuat.
 * Lưu ý: Không còn MaBenhNhan (đã chuyển sang DonThuoc).
 */
export interface PhieuXuat {
  MaPhieuXuat: string;
  NgayXuat: string; // Nên dùng string (ISO 8601) hoặc Date
  TongTien: number;
  MaNhanVien: string; // Khóa ngoại
  LoaiXuat: string; // [MỚI]

  // Dữ liệu lồng
  ChiTietXuat?: ChiTietXuat[];
}

/**
 * 1.7. Chi tiết phiếu xuất (ChiTietXuat)
 */
export interface ChiTietXuat {
  MaPhieuXuat: string;
  MaThuoc: string;
  SoLuongXuat: number;
  DonGiaXuat: number;

  // Dữ liệu join từ BE
  TenThuoc?: string;
}

/**
 * 1.8. Nhân viên (NhanVien)
 */

// Dùng để HIỂN THỊ (nhận từ BE, không có mật khẩu)
export interface NhanVien {
  MaNhanVien: string;
  TenNhanVien: string;
  TaiKhoan: string;
  VaiTro: string;
}

// Dùng để GỬI DỮ LIỆU TẠO MỚI (gửi lên BE)
export interface NhanVienCreateData {
  TenNhanVien: string;
  TaiKhoan: string;
  MatKhau: string; // Bắt buộc khi tạo mới
  VaiTro: string;
}

// Dùng để GỬI DỮ LIỆU CẬP NHẬT (gửi lên BE)
export interface NhanVienUpdateData {
  TenNhanVien?: string;
  TaiKhoan?: string;
  VaiTro?: string;
  // Không bao gồm MatKhau ở đây
}

/**
 * 1.9. Bệnh nhân (BenhNhan)
 */
export interface BenhNhan {
  MaBenhNhan: string;
  TenBenhNhan: string;
  NgaySinh: string; // Nên dùng string (ISO 8601) hoặc Date
  GioiTinh: string;
  SoDienThoai: string;
  DiaChi: string;
}

/**
 * 1.10. Đơn thuốc (DonThuoc)
 * [MỚI] Thêm thực thể mới.
 * [BỔ SUNG] Thêm MaPhieuXuat (FK).
 */
export interface DonThuoc {
  MaDonThuoc: string;
  MaPhieuXuat: string; // [MỚI] Khóa ngoại liên kết với Phiếu xuất
  NgayLap: string;
  TongTien: number;
  MaBenhNhan: string; // Khóa ngoại
  MaNhanVien: string; // Khóa ngoại

  // Dữ liệu lồng
  ChiTietDonThuoc?: ChiTietDonThuoc[];
}

/**
 * 1.11. Chi tiết đơn thuốc (ChiTietDonThuoc)
 * [MỚI] Thêm thực thể mới.
 */
export interface ChiTietDonThuoc {
  MaDonThuoc: string;
  MaThuoc: string;
  SoLuong: number;
  DonGiaBan: number;

  // Dữ liệu join từ BE
  TenThuoc?: string;
}


// === CÁC INTERFACE CHO TÍNH NĂNG (Dashboard, Reports) ===

/**
 * Dành cho Dashboard (Cảnh báo thuốc)
 * Lưu ý: 'HanSuDung' lấy từ 'ChiTietNhap' thay vì 'Thuoc'.
 */
export interface ThuocCanhBao {
  MaThuoc: string;
  TenThuoc: string;
  SoLuongTon: number;
  HanSuDung: string; // Dữ liệu này BE sẽ tổng hợp từ ChiTietNhap
  LyDo: 'SapHetHan' | 'SapHetHang';
}

/**
 * Dành cho Báo cáo Tồn kho
 */
export interface BaoCaoTonKho {
  TongSoLoaiThuoc: number;
  TongSoLuongTon: number;
  ThuocSapHetHan: Thuoc[];
  ThuocDaHetHan: Thuoc[];
  ThuocSapHetHang: Thuoc[];
}

/**
 * Dành cho Báo cáo Doanh thu
 */
export interface DuLieuDoanhThu {
  Thang: string;
  DoanhThu: number;
}
// src/interfaces/index.ts

// ... (Giữ nguyên các interface cũ của bạn) ...

// === CÁC INTERFACE CHO ĐĂNG NHẬP / ĐĂNG KÝ ===

/**
 * Dùng cho API Đăng nhập (Gửi lên BE)
 */
export interface LoginPayload {
  TaiKhoan: string;
  MatKhau: string;
}

/**
 * Dùng cho API Đăng nhập (Nhận từ BE)
 */
export interface LoginResponse {
  token: string;
  user: {
    MaNhanVien: string;
    TenNhanVien: string;
    VaiTro: string;
  };
}

/**
 * Dùng cho API Đăng ký (Gửi lên BE)
 * (Tệp RegisterForm.tsx của bạn cũng cần 'RegisterPayload' này)
 */
export interface RegisterPayload {
  TenNhanVien: string;
  TaiKhoan: string;
  MatKhau: string;
  VaiTro: string;
}


export interface RegisterResponse {
  message: string;
  MaNhanVien: string;
}
/**
 * 1.15. Dữ liệu cho Lịch sử Xuất Nội Bộ (Bỏ/Khác)
 */
export interface XuatNoiBoHistory {
  MaPhieuXuat: string;
  NgayXuat: string; // ISO date
  LoaiXuat: string; // Bỏ | Khác
  TenThuoc: string;
  SoLuongXuat: number;
  DonGiaXuat: number; // Giá vốn
  TenNhanVien: string;
}

/**
 * 1.16. Dữ liệu CHI TIẾT để TẠO phiếu xuất nội bộ
 */
export interface ChiTietXuatNoiBoCreate {
  MaThuoc: string;
  SoLuongXuat: number;
  DonGiaXuat: number; // Giá vốn (lấy từ GiaNhap)
}

/**
 * 1.17. Dữ liệu TỔNG QUÁT để TẠO phiếu xuất nội bộ
 */
export interface PhieuXuatNoiBoCreatePayload {
  MaNhanVien: string;
  LoaiXuat: string; // Bỏ | Khác
  chiTiet: ChiTietXuatNoiBoCreate[];
}
export interface ChiTietXuatPayload {
  MaThuoc: string;
  SoLuongXuat: number;
  DonGiaXuat: number;
}

export interface PhieuXuatPayload {
  MaNhanVien: string;
  LoaiXuat: string;
  TongTien: number;
  chiTiet: ChiTietXuatPayload[];
}