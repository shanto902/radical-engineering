"use client";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="inline-flex gap-2 overflow-x-auto max-w-full scrollbar-hide">
        <button
          aria-label="Previous page button"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="min-w-[70px] px-3 py-1 hover:bg-secondary border rounded disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              aria-label={`Page ${page}`}
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] px-3 py-1 border rounded text-sm ${
                currentPage === page
                  ? "bg-primary text-background"
                  : "hover:bg-secondary"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          aria-label="Next page button"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="min-w-[70px] px-3 py-1 border hover:bg-secondary rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
