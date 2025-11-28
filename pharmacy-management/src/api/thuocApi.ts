import { Thuoc } from '../interfaces';

// Đường dẫn này khớp với server.js và proxy
const API_BASE_URL = '/api/v1/thuoc';


/**
 * teet bắt lỗi mới , bắt lỗi cũ này quá phức tạp */
 
const handleResponse = async (response: Response) => {
  // BƯỚC 1: Đọc dữ liệu trả về dưới dạng chữ (text) trước để an toàn
  const responseText = await response.text();

  // BƯỚC 2: Kiểm tra xem Server có báo lỗi không (Mã 4xx, 5xx)
  if (!response.ok) {
    // Cố gắng đọc thông báo lỗi từ JSON server gửi (ví dụ: { "message": "Trùng mã" })
    try {
      const errorJson = JSON.parse(responseText);
      // Nếu đọc được message thì ném ra, còn không thì báo lỗi chung
      throw new Error(errorJson.message || 'Có lỗi xảy ra từ phía server');
    } catch (e) {
      // Nếu dữ liệu lỗi không phải JSON (ví dụ HTML lỗi 404), ném nguyên văn bản ra
      throw new Error(responseText || `Lỗi kết nối: ${response.status}`);
    }
  }

  // BƯỚC 3: Nếu thành công, chuyển Text thành JSON (nếu có dữ liệu)
  // Nếu chuỗi rỗng thì trả về null (tránh lỗi crash app)
  return responseText ? JSON.parse(responseText) : null;
};
/**
 * Lấy danh sách thuốc (Kết nối với GET /list)*/
 
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
    // [FIX] Ném lại lỗi để MedicineForm.tsx có thể bắt
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
    // [FIX] Ném lại lỗi để MedicineForm.tsx có thể bắt
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
    // Nếu OK (ví dụ 200, 204), chỉ cần trả về
  } catch (error) {
    console.error('Lỗi khi xóa thuốc:', error);
    // [FIX] Ném lại lỗi
    throw error;
  }
};
export const uploadMedicineImage = async (maThuoc: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file); // Key 'image' khớp với backend

  try {
    const response = await fetch(`${API_BASE_URL}/${maThuoc}/upload-image`, {
      method: 'POST',
      body: formData,
      // LƯU Ý QUAN TRỌNG: Khi dùng fetch với FormData, 
      // KHÔNG ĐƯỢC set 'Content-Type': 'multipart/form-data' thủ công.
      // Trình duyệt sẽ tự động làm việc này và thêm boundary cần thiết.
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error);
    throw error;
  }
};