// src/api/loginApi.ts
import { 
  LoginPayload, 
  LoginResponse, 
  RegisterPayload, 
  RegisterResponse 
} from '../interfaces';

// [SỬA 1] Sửa URL base. 
// Dùng đường dẫn tương đối. Proxy trong package.json sẽ lo phần còn lại.
const API_BASE_URL = '/api/v1/auth'; 

/**
 * [SỬA 2] Thêm hàm handleResponse để xử lý lỗi từ Backend
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Nếu response không OK (lỗi 400, 404, 500)
    try {
      // Thử đọc lỗi dưới dạng JSON (BE thường trả về { message: "..." })
      const errorData = await response.json();
      throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
    } catch (jsonError) {
      // Nếu đọc JSON thất bại (vì nó là HTML 404), đọc nó dưới dạng text
      const errorText = await response.text();
      throw new Error(errorText || `Lỗi ${response.status}: ${response.statusText}`);
    }
  }
  // Nếu response OK (200, 201), trả về data
  return response.json();
};

/**
 * API Đăng nhập (Gửi lên BE)
 * [SỬA 3] Nhận camelCase (từ form), gửi PascalCase (cho BE)
 */
export const loginAPI = async (credentials: { taiKhoan: string, matKhau: string }): Promise<LoginResponse> => {
  
  // "Dịch" từ camelCase (form) sang PascalCase (BE)
  const payload: LoginPayload = {
    TaiKhoan: credentials.taiKhoan,
    MatKhau: credentials.matKhau,
  };
  
  // URL bây giờ sẽ đúng: /api/v1/auth/login
  const response = await fetch(`${API_BASE_URL}/login`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), // Gửi payload đã dịch (PascalCase)
  });
  return handleResponse(response);
};

/**
 * API Đăng ký (Gửi lên BE)
 * [SỬA 4] Nhận camelCase (từ form), gửi PascalCase (cho BE)
 */
export const registerAPI = async (userData: { tenNhanVien: string, taiKhoan: string, matKhau: string, vaiTro: string }): Promise<RegisterResponse> => {
  
  // "Dịch" từ camelCase (form) sang PascalCase (BE)
  const payload: RegisterPayload = {
    TenNhanVien: userData.tenNhanVien,
    TaiKhoan: userData.taiKhoan,
    MatKhau: userData.matKhau,
    VaiTro: userData.vaiTro,
  };

  // URL bây giờ sẽ đúng: /api/v1/auth/register
  const response = await fetch(`${API_BASE_URL}/register`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), // Gửi payload đã dịch (PascalCase)
  });
  return handleResponse(response);
};