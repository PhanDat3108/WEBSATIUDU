import { Thuoc } from '../interfaces';

const API_BASE_URL = '/api/v1/thuoc';

//  Hàm chung để xử lý response từ fetch
const handleResponse = async (response: Response) => {
  
  const responseText = await response.text();
  
  if (!response.ok) {
    try {
      const errorJson = JSON.parse(responseText);
      throw new Error(errorJson.message || 'Có lỗi xảy ra từ phía server');
    } catch (e) {
      
      throw new Error(responseText || `Lỗi kết nối: ${response.status}`);
    }
  }
  return responseText ? JSON.parse(responseText) : null;
};

/**
 * Lấy danh sách thuốc (Kết nối với GET /list)
 */
export const getMedicines = async (): Promise<Thuoc[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/list`);
    const data = await handleResponse(response);
    return data as Thuoc[]; 
  } catch (error) {
    console.error('Lỗi khi tải danh sách thuốc:', error);
    throw error;
  }
};

/**
 * Thêm thuốc
 */
export const addMedicine = async (thuocData: Partial<Thuoc>): Promise<Thuoc> => {
  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thuocData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi thêm thuốc:', error);
    
    throw error;
  }
};

/**
 * Cập nhật thuốc
 */
export const updateMedicine = async (maThuoc: string, data: Partial<Thuoc>): Promise<Thuoc> => {
  
  try {
    const response = await fetch(`${API_BASE_URL}/fix/${maThuoc}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi cập nhật thuốc:', error);
    //  Ném lại lỗi để MedicineForm.tsx có thể bắt
    throw error;
  }
};

/**
 * Xóa thuốc (Kết nối với DELETE /delete/:maThuoc)
 */
export const deleteMedicine = async (maThuoc: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${maThuoc}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
       await handleResponse(response); // Ném lỗi nếu có
    }
    
  } catch (error) {
    console.error('Lỗi khi xóa thuốc:', error);
    throw error;
  }
};
export const uploadMedicineImage = async (maThuoc: string, file: File) => {
  // 1. Tạo FormData để gửi file
  const formData = new FormData();
  formData.append("image", file); // Key "image" phải khớp với backend (upload.single('image'))

  try {
    // 2. Gọi API
    
    const response = await fetch(`${API_BASE_URL}/${maThuoc}/upload-image`, {
      method: "POST",
      body: formData,
    });

    // 3. Xử lý kết quả
    return await handleResponse(response);
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    throw error;
  }
};
export const getHotProducts = async (): Promise<Thuoc[]> => {
  const response = await fetch(`${API_BASE_URL}/hot`);
  if (!response.ok) throw new Error('Lỗi tải hàng Hot');
  return response.json();
};

export const getNewProducts = async (): Promise<Thuoc[]> => {
  const response = await fetch(`${API_BASE_URL}/new`);
  if (!response.ok) throw new Error('Lỗi tải hàng Mới');
  return response.json();
};

export const getFreeProducts = async (): Promise<Thuoc[]> => {
  const response = await fetch(`${API_BASE_URL}/free`);
  if (!response.ok) throw new Error('Lỗi tải hàng Free');
  return response.json();
};
export const getThuocByCategory = async (maLoai: string): Promise<Thuoc[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/danhmuc/${maLoai}`);
    const data = await handleResponse(response);
    return data as Thuoc[];
  } catch (error) {
    console.error('Lỗi khi tải thuốc theo danh mục:', error);
    throw error;
  }
};

export const getAllThuoc = getMedicines;