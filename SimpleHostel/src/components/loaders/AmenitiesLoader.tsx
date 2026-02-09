
 const AmenitiesLoader = () => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-gray-300 rounded-md w-32 animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
                    <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
                    <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-[300px]">
                        <div className="w-full h-10 bg-gray-300 rounded-md animate-pulse"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-gray-300 rounded-md w-24 animate-pulse"></div>
                    </div>
                </div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="h-10 bg-gray-300 rounded-md animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default AmenitiesLoader;