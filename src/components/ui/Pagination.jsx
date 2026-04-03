import React from 'react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  itemName = 'عنصر',
  onPageChange
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
      }
    }
    return pages;
  };

  const pages = getVisiblePages();

  return (
    <div className="border-t border-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
      <p className="text-sm font-bold text-slate-500">
        عرض <span className="text-slate-800">{startItem}</span> إلى <span className="text-slate-800">{endItem}</span> من أصل <span className="text-slate-800">{totalItems}</span> {itemName}
      </p>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button 
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded-xl font-bold text-sm transition-colors ${
            currentPage === 1 
              ? 'border-slate-200 text-slate-400 bg-white cursor-not-allowed' 
              : 'border-slate-200 text-slate-700 hover:bg-slate-50 bg-white cursor-pointer'
          }`}
        >
          السابق
        </button>
        
        {pages.map(page => (
          <button 
            key={page}
            onClick={() => onPageChange && onPageChange(page)}
            className={`w-10 h-10 flex-shrink-0 rounded-xl font-bold cursor-pointer transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button 
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-4 py-2 border rounded-xl font-bold text-sm transition-colors ${
            currentPage === totalPages || totalPages === 0
              ? 'border-slate-200 text-slate-400 bg-white cursor-not-allowed' 
              : 'border-slate-200 text-slate-700 hover:bg-slate-50 bg-white cursor-pointer'
          }`}
        >
          التالي
        </button>
      </div>
    </div>
  );
}
