// src/hooks/usePagination.tsx
import { useState } from 'react';
import Pagination from './Pagination'; // Import cái UI bạn đã tạo ở bước trước

export const usePagination = <T,>(fullList: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Logic tính toán cắt mảng (tự động làm hết)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Dữ liệu đã được cắt gọn để hiển thị
  const currentData = fullList.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm chuyển trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Component Phân trang đã được đấu nối sẵn logic
  const PaginationComponent = () => (
    <Pagination
      itemsPerPage={itemsPerPage}
      totalItems={fullList.length}
      paginate={paginate}
      currentPage={currentPage}
    />
  );

  return { currentData, PaginationComponent, currentPage, setCurrentPage };
};