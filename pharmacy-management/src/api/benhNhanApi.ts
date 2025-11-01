// src/api/benhNhanApi.ts
import { BenhNhan } from '../interfaces';

const API_BASE_URL = '/api/v1/benhnhan';

export const getPatients = async (): Promise<BenhNhan[]> => {
  console.log('GỌI API: getPatients (BE CHƯA SẴN SÀNG)');
  return Promise.resolve([]);
  
  /* // --- KHI BE SẴN SÀNG ---
  // const response = await fetch(API_BASE_URL);
  // return await response.json();
  */
};

export const addPatient = async (benhNhanData: Omit<BenhNhan, 'MaBenhNhan'>): Promise<BenhNhan> => {
  console.log('GỌI API: addPatient (BE CHƯA SẴN SÀNG)', benhNhanData);
  return Promise.reject(new Error('Chức năng chưa sẵn sàng (đang chờ BE).'));
};

export const updatePatient = async (maBenhNhan: string, data: Partial<BenhNhan>): Promise<BenhNhan> => {
  console.log('GỌI API: updatePatient (BE CHƯA SẴN SÀNG)', maBenhNhan, data);
  return Promise.reject(new Error('Chức năng chưa sẵn sàng (đang chờ BE).'));
};

export const deletePatient = async (maBenhNhan: string): Promise<void> => {
  console.log('GỌI API: deletePatient (BE CHƯA SẴN SÀNG)', maBenhNhan);
  return Promise.reject(new Error('Chức năng chưa sẵn sàng (đang chờ BE).'));
};