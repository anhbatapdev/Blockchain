import React from 'react';
import { getStatusInfo, getStatusColorClasses } from '../utils/helpers';

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

const StatusBadge = ({ statusCode, size = 'md' }) => {
  const info = getStatusInfo(statusCode);
  const colorClasses = getStatusColorClasses(statusCode);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size] || sizeClasses.md} ${colorClasses}`}
    >
      <span>{info?.icon || '❓'}</span>
      <span>{info?.label || 'Không rõ'}</span>
    </span>
  );
};

export default StatusBadge;
