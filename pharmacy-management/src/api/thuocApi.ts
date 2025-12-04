import { Thuoc } from '../interfaces';

// Đường dẫn này khớp với server.js và proxy
const API_BASE_URL = '/api/v1/thuoc';

/**
 * [ĐÃ SỬA LẦN 2] Hàm chung để xử lý response từ fetch
 */
const handleResponse = async (response: Response) => {
  const responseBodyAsText = await response.text();

  if (!response.ok) {
    // Nếu response không OK (lỗi 4xx, 5xx)
    try {
      // [FIX 1] Thử parse text thành JSON (cho các lỗi 400, 404, 500 mà BE gửi chuẩn)
      const errorData = JSON.parse(responseBodyAsText);
      throw new Error(errorData.message || 'Lỗi từ server (đã parse JSON)');
    } catch (jsonParseError) {
      // [FIX 2] Nếu parse lỗi (vì BE gửi text/html, hoặc chuỗi chứa JSON)
      
      // Kiểm tra xem có phải là chuỗi JSON không hợp lệ mà BE gửi không
      // Ví dụ: {"message":"Lỗi khi thêm thuốc!"}... (thừa dấu '...')
      // Chúng ta sẽ cố gắng "cứu" thông báo lỗi từ chuỗi này
      if (responseBodyAsText.includes('{"message":')) {
        try {
           // Dùng regex để trích xuất thông báo lỗi
           const match = responseBodyAsText.match(/{"message":"(.*?)"}/);
           if (match && match[1]) {
             throw new Error(match[1]); // Ném ra thông báo lỗi đã trích xuất
           }
        } catch (e) {
            // Không cứu được, ném lỗi chung bên dưới
        }
      }

      // Nếu không cứu được, đây là lỗi HTML 500 (crash server)
      throw new Error(`Lỗi ${response.status}: ${response.statusText}. Phản hồi không phải JSON: ${responseBodyAsText.substring(0, 200)}...`);
    }
  }

  // Nếu response OK (2xx)
  try {
     // Chúng ta kỳ vọng 2xx luôn là JSON
    return JSON.parse(responseBodyAsText);
  } catch (jsonParseError) {
    // Bắt lỗi nếu server trả về 2xx nhưng body không phải JSON
    // Hoặc trường hợp responseBodyAsText là rỗng (ví dụ: 204 No Content)
    if (responseBodyAsText.trim() === "") {
        return {}; // Trả về đối tượng rỗng nếu body rỗng
    }
    throw new Error('Server trả về phản hồi OK nhưng không phải JSON.');
  }
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
  // 1. Tạo FormData để gửi file
  const formData = new FormData();
  formData.append("image", file); // Key "image" phải khớp với backend (upload.single('image'))

  try {
    // 2. Gọi API
    // Lưu ý: Không set 'Content-Type': 'application/json' khi gửi FormData
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