import React from "react";

interface Props {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
  onChangePageSize?: (size: number) => void;
}

const Pagination: React.FC<Props> = ({ itemsPerPage, totalItems, paginate, currentPage, onChangePageSize }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getVisiblePages = () => {
    const max = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + max - 1);

    if (end - start < max - 1) {
      start = Math.max(1, end - max + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  const baseBtn: React.CSSProperties = {
    padding: "6px 12px",
    background: "#f5f5f5",
    margin: "0 -3px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
    transition: "all 0.2s ease",
  };

  const btnHover: React.CSSProperties = {
    background: "#e6e6e6",
  };

  const btnActive: React.CSSProperties = {
    background: "#1677ff",
    color: "#fff",
    fontWeight: 600,
  };

  const btnDisabled: React.CSSProperties = {
    opacity: 0.4,
    cursor: "not-allowed",
    background: "#f0f0f0",
  };

  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 14, opacity: 0.7 }}>
        Tổng số: <b>{totalItems}</b>
      </span>

      {onChangePageSize && (
        <select
          value={itemsPerPage}
          onChange={(e) => onChangePageSize(Number(e.target.value))}
          style={{
            padding: "4px 8px",
            borderRadius: 6,
            cursor: "pointer",
            background: "#fafafa",
            fontSize: 14,
          }}
        >
          <option value={8}>8 / trang</option>
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
        </select>
      )}

      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...baseBtn,
          ...(currentPage === 1 ? btnDisabled : {}),
        }}
        onMouseEnter={(e) => !(currentPage === 1) && Object.assign(e.currentTarget.style, btnHover)}
        onMouseLeave={(e) => !(currentPage === 1) && Object.assign(e.currentTarget.style, baseBtn)}
      >
        {"<"}
      </button>

      {visiblePages.map((num) => (
        <button
          key={num}
          onClick={() => paginate(num)}
          style={currentPage === num ? { ...baseBtn, ...btnActive } : baseBtn}
          onMouseEnter={(e) => currentPage !== num && Object.assign(e.currentTarget.style, btnHover)}
          onMouseLeave={(e) => currentPage !== num && Object.assign(e.currentTarget.style, baseBtn)}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...baseBtn,
          ...(currentPage === totalPages ? btnDisabled : {}),
        }}
        onMouseEnter={(e) => !(currentPage === totalPages) && Object.assign(e.currentTarget.style, btnHover)}
        onMouseLeave={(e) => !(currentPage === totalPages) && Object.assign(e.currentTarget.style, baseBtn)}
      >
        {">"}
      </button>
    </nav>
  );
};

export default Pagination;
