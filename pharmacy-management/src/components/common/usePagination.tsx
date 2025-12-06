// src/hooks/usePagination.tsx
import { useState } from "react";
import Pagination from "./Pagination";

export const usePagination = <T,>(fullList: T[]) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(8);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = fullList.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleChangePageSize = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const PaginationComponent = () => (
    <Pagination
      itemsPerPage={itemsPerPage}
      totalItems={fullList.length}
      paginate={paginate}
      currentPage={currentPage}
      onChangePageSize={handleChangePageSize}
    />
  );

  return { currentData, PaginationComponent, currentPage, setCurrentPage };
};
