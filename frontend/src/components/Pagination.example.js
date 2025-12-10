/**
 * Pagination Component Usage Example
 * 
 * This file demonstrates how to use the Pagination component in your pages.
 */

import { useState, useEffect } from 'react';
import Pagination from './Pagination';

const ExamplePage = () => {
  const [data, setData] = useState([/* your data array */]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust as needed

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Optional: scroll to top
  };

  // Reset to page 1 when data changes (e.g., after filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  return (
    <div>
      {/* Render your paginated data */}
      {paginatedData.map(item => (
        <div key={item.id}>{/* Your item component */}</div>
      ))}

      {/* Pagination Component */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        maxPagesToShow={5} // Optional: default is 5
      />

      {/* Optional: Show results info */}
      <div className="text-center text-muted mt-3">
        <small>
          Showing {startIndex + 1} - {Math.min(endIndex, data.length)} of {data.length} items
        </small>
      </div>
    </div>
  );
};

export default ExamplePage;
