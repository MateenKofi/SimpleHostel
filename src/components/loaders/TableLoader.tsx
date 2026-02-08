import { Skeleton } from '../../components/ui/skeleton';

const TableLoader = () => {
  return (
    <div className="space-y-4 w-full">
      {/* Title skeleton */}
      <Skeleton className="h-6 w-1/4" />

      {/* Search bar skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 shrink-0" />
        <Skeleton className="h-9 w-64" />
      </div>

      {/* Table rows skeleton */}
      <div className="space-y-3 pt-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="h-10 w-20 shrink-0" />
            <Skeleton className="h-10 w-20 shrink-0" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
};

export default TableLoader;
