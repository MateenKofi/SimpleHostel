const ResidentLoader = () => {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1 h-6 bg-gray-300 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };
export default ResidentLoader;