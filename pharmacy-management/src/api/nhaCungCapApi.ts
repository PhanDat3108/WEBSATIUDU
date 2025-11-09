
import { NhaCungCap } from '../interfaces';


const API_BASE_URL = '/api/v1/nhacungcap'; 


const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
    } catch (jsonError) {
      const errorText = await response.text();
      throw new Error(`Lỗi ${response.status}: ${response.statusText}. Phản hồi không phải JSON.`);
    }
  }
  return response.json();
};


export const getNhaCungCapList = async (): Promise<NhaCungCap[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi tải danh sách nhà cung cấp:', error);
    throw error;
  }
};