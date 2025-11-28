import { 
  LoginPayload, 
  LoginResponse, 
  RegisterPayload, 
  RegisterResponse 
} from '../interfaces';

// Đường dẫn tương đối
const API_BASE_URL = '/api/v1/auth'; 

// Hàm xử lý response chung
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
    } catch (jsonError) {
      const errorText = await response.text();
      throw new Error(errorText || `Lỗi ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
};

// Xuất ra một Object chứa các hàm (để bên kia gọi loginApi.login được)
export const loginApi = {
  
  // 1. Hàm Đăng nhập
  login: async (taiKhoan: string, matKhau: string): Promise<LoginResponse> => {
    const payload: LoginPayload = {
      TaiKhoan: taiKhoan,
      MatKhau: matKhau,
    };
    
    const response = await fetch(`${API_BASE_URL}/login`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), 
    });
    return handleResponse(response);
  },

  // 2. Hàm Đăng ký
  register: async (userData: { tenNhanVien: string, taiKhoan: string, matKhau: string, vaiTro: string }): Promise<RegisterResponse> => {
    const payload: RegisterPayload = {
      TenNhanVien: userData.tenNhanVien,
      TaiKhoan: userData.taiKhoan,
      MatKhau: userData.matKhau,
      VaiTro: userData.vaiTro,
    };

    const response = await fetch(`${API_BASE_URL}/register`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  }
};