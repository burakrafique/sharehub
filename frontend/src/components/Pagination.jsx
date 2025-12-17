import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  maxPagesToShow = 5 
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="d-flex justify-content-center mt-4">
      <BootstrapPagination>
        {/* First Page */}
        <BootstrapPagination.First 
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        />

        {/* Previous Page */}
        <BootstrapPagination.Prev 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {/* Show first page if not in range */}
        {pageNumbers[0] > 1 && (
          <>
            <BootstrapPagination.Item onClick={() => onPageChange(1)}>
              1
            </BootstrapPagination.Item>
            {pageNumbers[0] > 2 && <BootstrapPagination.Ellipsis disabled />}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map(page => (
          <BootstrapPagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </BootstrapPagination.Item>
        ))}

        {/* Show last page if not in range */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <BootstrapPagination.Ellipsis disabled />
            )}
            <BootstrapPagination.Item onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </BootstrapPagination.Item>
          </>
        )}

        {/* Next Page */}
        <BootstrapPagination.Next 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />

        {/* Last Page */}
        <BootstrapPagination.Last 
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </BootstrapPagination>
    </div>
  );
};

export default Pagination;
