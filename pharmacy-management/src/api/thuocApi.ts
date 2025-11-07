// // src/api/thuocApi.ts
// import { Thuoc } from '../interfaces';

// const API_BASE_URL = '/api/v1/thuoc';

// /**
//  * Hàm chung để xử lý response từ fetch
//  */
// const handleResponse = async (response: Response) => {
//   if (!response.ok) {
//     // Thử đọc lỗi dưới dạng JSON trước
//     try {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
//     } catch (jsonError) {
//       // Nếu thất bại (vì response là HTML/Text), đọc dưới dạng text
//       const errorText = await response.text();
//       // Ném lỗi này (có thể là lỗi HTML 404 hoặc 500)
//       throw new Error(errorText || 'Lỗi không xác định');
//     }
//   }
//   return response.json();
// };

// /**
//  * Lấy danh sách thuốc (Giữ nguyên)
//  */
// export const getMedicines = async (): Promise<Thuoc[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/list`);
//     const data = await handleResponse(response);
//     return data as Thuoc[]; 
//   } catch (error) {
//     console.error('Lỗi khi tải danh sách thuốc:', error);
//     throw error;
//   }
// };

// /**
//  * [ĐÃ SỬA] Thêm thuốc
//  */
// export const addMedicine = async (thuocData: Partial<Thuoc>): Promise<Thuoc> => {
//   // [SỬA LỖI Ở ĐÂY] "Dịch" từ PascalCase (FE) sang camelCase (BE yêu cầu)
//   const dataForBackend = {
//     tenThuoc: thuocData.TenThuoc,
//     donViTinh: thuocData.DonViTinh,
//     soLuongTon: thuocData.SoLuongTon,
//     giaNhap: thuocData.GiaNhap,
//     giaBan: thuocData.GiaBan,
//     hanSuDung: thuocData.HanSuDung,
//     ngayNhap: thuocData.NgayNhap,
//     maLoai: thuocData.MaLoai,
//     nhaCungCap: thuocData.NhaCungCap,
//   };

//   try {
//     const response = await fetch(`${API_BASE_URL}/add`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(dataForBackend), // Gửi dữ liệu đã "dịch"
//     });
//     return await handleResponse(response);
//   } catch (error) {
//     console.error('Lỗi khi thêm thuốc:', error);
//     throw error;
//   }
// };

// /**
//  * [ĐÃ SỬA] Cập nhật thuốc
//  */
// export const updateMedicine = async (maThuoc: string, data: Partial<Thuoc>): Promise<Thuoc> => {
//   // [SỬA LỖI Ở ĐÂY] "Dịch" từ PascalCase (FE) sang camelCase (BE yêu cầu)
//   const dataForBackend = {
//     maThuoc: maThuoc, // BE (thuoc.js) cũng cần maThuoc trong body
//     tenThuoc: data.TenThuoc,
//     donViTinh: data.DonViTinh,
//     soLuongTon: data.SoLuongTon,
//     giaNhap: data.GiaNhap,
//     giaBan: data.GiaBan,
//     hanSuDung: data.HanSuDung,
//     ngayNhap: data.NgayNhap,
//     maLoai: data.MaLoai,
//     nhaCungCap: data.NhaCungCap,
//   };

//   try {
//     // BE (thuoc.js) dùng đường dẫn /fix
//     const response = await fetch(`${API_BASE_URL}/fix`, { 
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(dataForBackend), // Gửi dữ liệu đã "dịch"
//     });
//     return await handleResponse(response);
//   } catch (error) {
//     console.error('Lỗi khi cập nhật thuốc:', error);
//     throw error;
//   }
// };

// /**
//  * Xóa thuốc (Giữ nguyên)
//  */
// export const deleteMedicine = async (maThuoc: string): Promise<void> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/delete/${maThuoc}`, {
//       method: 'DELETE',
//     });
//     return await handleResponse(response);
//   } catch (error) {
//     console.error('Lỗi khi xóa thuốc:', error);
//     throw error;
//   }
// };
// src/api/thuocApi.ts
import { Thuoc } from '../interfaces';

// Đường dẫn này khớp với server.js và proxy
const API_BASE_URL = '/api/v1/thuoc';

/**
 * Hàm chung để xử lý response từ fetch
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Nếu response không OK, thử đọc lỗi dưới dạng JSON
    try {
      const errorData = await response.json();
      // Nếu BE trả về JSON lỗi (VD: { message: "..." }), ném ra lỗi đó
      throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
    } catch (jsonError) {
      // Nếu đọc JSON thất bại (vì nó là HTML 404), đọc nó dưới dạng text
      const errorText = await response.text();
      // Ném ra lỗi (đây là nơi bạn thấy lỗi "Unexpected token '<'" trước đây)
      throw new Error(`Lỗi ${response.status}: ${response.statusText}. Phản hồi không phải JSON.`);
    }
  }
  // Nếu response OK (200, 201), trả về data
  return response.json();
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
 * [ĐÃ SỬA] Thêm thuốc (Không cần dịch)
 */
export const addMedicine = async (thuocData: Partial<Thuoc>): Promise<Thuoc> => {
  // Giờ BE đã dùng PascalCase, chúng ta gửi 'thuocData' trực tiếp
  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thuocData), // Gửi thẳng PascalCase
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi thêm thuốc:', error);
    throw error;
  }
};

/**
 * [ĐÃ SỬA] Cập nhật thuốc (Sửa đường dẫn VÀ Không cần dịch)
 */
export const updateMedicine = async (maThuoc: string, data: Partial<Thuoc>): Promise<Thuoc> => {
  
  try {
    // [SỬA 1] Sửa đường dẫn từ /edit/... thành /fix
    // File thuoc.js của BE đang dùng /fix
    const response = await fetch(`${API_BASE_URL}/fix`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      // [SỬA 2] Gửi dữ liệu PascalCase (đã bao gồm MaThuoc)
      // File MedicineForm.tsx đã gửi MaThuoc trong 'data'
      // à, file MedicineForm.tsx KHÔNG gửi MaThuoc trong data.
      // Chúng ta cần thêm nó vào.
      body: JSON.stringify({
        ...data,
        MaThuoc: maThuoc // Gửi MaThuoc mà BE (thuoc.js) cần
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi cập nhật thuốc:', error);
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
    // Xóa thành công thường không có body JSON, nên xử lý riêng
    if (!response.ok) {
       await handleResponse(response); // Ném lỗi nếu có
    }
    // Nếu OK (ví dụ 200, 204), chỉ cần trả về
  } catch (error) {
    console.error('Lỗi khi xóa thuốc:', error);
    throw error;
  }
};