type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div className="table-skeleton">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div className="table-skeleton-row" key={`row-${rowIndex}`}>
          {Array.from({ length: columns }).map((__, colIndex) => (
            <span className="table-skeleton-cell" key={`cell-${rowIndex}-${colIndex}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
