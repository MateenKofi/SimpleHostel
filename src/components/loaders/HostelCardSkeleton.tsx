const FindHostelSkeleton = () => {
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

          {/* Hostel card grid - new overlay design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="aspect-[3/4] rounded-xl overflow-hidden animate-pulse bg-gray-300 relative"
              >
                {/* Image placeholder */}
                <div className="absolute inset-0 bg-gray-300" />

                {/* Gradient overlay placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-400/50 to-transparent" />

                {/* Content overlay placeholder */}
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                  {/* Title and rating */}
                  <div className="flex justify-between gap-2">
                    <div className="h-5 bg-gray-400 rounded w-2/3" />
                    <div className="h-6 bg-gray-400 rounded-full w-10 shrink-0" />
                  </div>

                  {/* Location */}
                  <div className="h-4 bg-gray-400 rounded w-1/2" />

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-400 rounded-lg flex-1" />
                    <div className="h-8 bg-gray-400 rounded-lg flex-[2]" />
                  </div>

                  {/* Price and button */}
                  <div className="flex justify-between items-center gap-3">
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-400 rounded w-16" />
                      <div className="h-5 bg-gray-400 rounded w-20" />
                    </div>
                    <div className="h-9 bg-gray-400 rounded-lg w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindHostelSkeleton;
