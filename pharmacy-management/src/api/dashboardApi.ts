// [ĐÃ SỬA] Import từ Database Giả
import { mockMedicines } from './mockDatabase';
// [ĐÃ SỬA] Import ExpiryReport từ file interfaces/index.ts
import { ExpiryReport } from '../interfaces'; 

// [XÓA] Xóa định nghĩa interface ở đây vì đã chuyển sang file index.ts

export const getExpiryStatusReport = async (): Promise<ExpiryReport> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const today = new Date(); // 31/10/2025
            today.setHours(0, 0, 0, 0);

            const warningDateLimit = new Date();
            warningDateLimit.setDate(today.getDate() + 90); 

            let expired = 0;
            let expiringSoon = 0;
            let good = 0;

            // Dùng mockMedicines đã import
            mockMedicines.forEach(med => {
                const expiryDate = new Date(med.hsd);
                
                if (expiryDate < today) {
                    expired++;
                } else if (expiryDate >= today && expiryDate <= warningDateLimit) {
                    expiringSoon++;
                } else {
                    good++;
                }
            });

            resolve({ expired, expiringSoon, good });
        }, 100);
    });
};