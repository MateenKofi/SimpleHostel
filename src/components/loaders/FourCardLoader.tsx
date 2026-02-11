import React from 'react'

const FourCardLoader = () => {
  return (
    <div>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
            <div
                key={index}
                className="p-4 bg-gray-200 rounded-lg shadow-md animate-pulse"
            >
                <div className="h-32 mb-4 bg-gray-300 rounded"></div>
                <div className="h-6 mb-2 bg-gray-300 rounded"></div>
                <div className="h-6 mb-2 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
            </div>
            ))}
        </div>
    </div>
  )
}

export default FourCardLoader