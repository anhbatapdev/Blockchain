import React from 'react';
import { formatAddress, formatTimestamp } from '../utils/helpers';
import StatusBadge from './StatusBadge';

const Timeline = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Chưa có lịch sử cập nhật nào.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-indigo-200"></div>

      <div className="space-y-6">
        {history.map((entry, index) => {
          const isLast = index === history.length - 1;

          return (
            <div key={index} className="relative">
              {/* Dot */}
              <div
                className={`absolute -left-[1.125rem] top-2 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${
                  isLast
                    ? 'bg-indigo-600 animate-pulse'
                    : 'bg-indigo-400'
                }`}
              ></div>

              {/* Card */}
              <div
                className={`ml-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  index % 2 === 0
                    ? 'bg-white border-gray-100'
                    : 'bg-indigo-50/50 border-indigo-100'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <StatusBadge statusCode={entry.status} size="sm" />
                  {isLast && (
                    <span className="text-xs text-indigo-600 font-semibold bg-indigo-100 px-2 py-0.5 rounded-full">
                      Hiện tại
                    </span>
                  )}
                </div>

                {entry.location && (
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium text-gray-500">📍 Địa điểm:</span>{' '}
                    {entry.location}
                  </p>
                )}

                {entry.details && (
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium text-gray-500">📝 Chi tiết:</span>{' '}
                    {entry.details}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                  <span>
                    👤 {formatAddress(entry.actor)}
                  </span>
                  <span>
                    🕐 {formatTimestamp(entry.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
