type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="pagination">
      <button disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button disabled={!canNext} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
