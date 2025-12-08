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
  // 1. Đọc text ra trước để an toàn
  const text = await response.text(); 
  
  // 2. Thử parse JSON
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    data = {}; // Nếu không phải JSON thì data rỗng
  }

  // 3. Nếu có lỗi HTTP (4xx, 5xx)
  if (!response.ok) {
    const errorMsg = (data && data.message) || text || response.statusText;
    throw new Error(errorMsg);
  }

  // 4. Trả về data
  return data;
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