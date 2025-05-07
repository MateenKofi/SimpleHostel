const FindHostelSkeleton =()=> {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter panel skeleton */}
        <div className="w-full lg:w-64 space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="h-6 bg-gray-300 rounded animate-pulse" />
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 space-y-6">
          {/* Search input skeleton */}
          <div className="h-10 bg-gray-300 rounded animate-pulse" />

          {/* Active filter badges */}
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-6 w-20 bg-gray-300 rounded-full animate-pulse"
              />
            ))}
          </div>

          {/* Hostel card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="border rounded-md overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-gray-300 w-full" />
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-300 rounded w-1/2" />
                    <div className="h-10 bg-gray-300 rounded w-1/2" />
                  </div>
                  <div className="h-10 bg-gray-300 rounded w-full" />
                  <div className="h-10 bg-gray-300 rounded w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default FindHostelSkeleton