import React from 'react';

const LoadingSpinner = ({ message = 'Đang tải...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
