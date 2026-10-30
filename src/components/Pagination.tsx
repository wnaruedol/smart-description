import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  colorTheme?: 'blue' | 'indigo';
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  colorTheme = 'blue',
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);

      if (leftBound > 2) {
        pages.push('...');
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      if (rightBound < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const activeBtnClasses =
    colorTheme === 'indigo'
      ? 'bg-indigo-600 text-white font-semibold shadow-xs hover:bg-indigo-700'
      : 'bg-blue-600 text-white font-semibold shadow-xs hover:bg-blue-700';

  const defaultBtnClasses =
    'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-slate-200 text-xs text-slate-600">
      {/* Left side: Showing X-Y of Z and page size selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span>
          แสดง <strong className="text-slate-800">{startItem}</strong> -{' '}
          <strong className="text-slate-800">{endItem}</strong> จากทั้งหมด{' '}
          <strong className="text-slate-800">{totalItems}</strong> รายการ
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-slate-500">แสดงหน้าละ:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="text-slate-500">รายการ</span>
          </div>
        )}
      </div>

      {/* Right side: Page navigation */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-1.5 rounded-md border border-slate-200 transition-colors ${
            currentPage === 1
              ? 'text-slate-300 bg-slate-50 cursor-not-allowed border-slate-200'
              : 'text-slate-600 bg-white hover:bg-slate-50 cursor-pointer'
          }`}
          title="หน้าแรก"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-1.5 rounded-md border border-slate-200 transition-colors ${
            currentPage === 1
              ? 'text-slate-300 bg-slate-50 cursor-not-allowed border-slate-200'
              : 'text-slate-600 bg-white hover:bg-slate-50 cursor-pointer'
          }`}
          title="ก่อนหน้า"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400 select-none">
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-7 h-7 px-2 rounded-md text-xs transition-colors cursor-pointer ${
                  isActive ? activeBtnClasses : defaultBtnClasses
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`p-1.5 rounded-md border border-slate-200 transition-colors ${
            currentPage >= totalPages
              ? 'text-slate-300 bg-slate-50 cursor-not-allowed border-slate-200'
              : 'text-slate-600 bg-white hover:bg-slate-50 cursor-pointer'
          }`}
          title="ถัดไป"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className={`p-1.5 rounded-md border border-slate-200 transition-colors ${
            currentPage >= totalPages
              ? 'text-slate-300 bg-slate-50 cursor-not-allowed border-slate-200'
              : 'text-slate-600 bg-white hover:bg-slate-50 cursor-pointer'
          }`}
          title="หน้าสุดท้าย"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
