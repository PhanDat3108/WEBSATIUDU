// src/components/common/Pagination.tsx
import React from 'react';
import styles from '../../styles/Pagination.module.css';

interface Props {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: React.FC<Props> = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null; // Nếu chỉ có 1 trang thì ẩn đi

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className={styles.paginationContainer}>
      <button 
        onClick={() => paginate(currentPage - 1)} 
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        Trước
      </button>

      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`${styles.pageButton} ${currentPage === number ? styles.active : ''}`}
        >
          {number}
        </button>
      ))}

      <button 
        onClick={() => paginate(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        Sau
      </button>
    </nav>
  );
};

export default Pagination;