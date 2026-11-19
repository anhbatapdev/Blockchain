import React from 'react';
import StatusBadge from './StatusBadge';
import { formatAddress, formatTimestamp } from '../utils/helpers';
import { FiPackage, FiArrowRight } from 'react-icons/fi';

const ProductCard = ({ product, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl border border-gray-100 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          <FiPackage className="w-3 h-3" />
          #{product.id?.toString()}
        </span>
        <StatusBadge statusCode={product.status} size="sm" />
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
        {product.name}
      </h3>

      {/* Info rows */}
      <div className="space-y-1.5 text-sm text-gray-500 mb-4">
        <p>
          <span className="font-medium text-gray-400">Xuất xứ:</span> {product.origin}
        </p>
        <p>
          <span className="font-medium text-gray-400">Nhà SX:</span> {product.manufacturer}
        </p>
        <p>
          <span className="font-medium text-gray-400">Chủ sở hữu:</span>{' '}
          {formatAddress(product.currentOwner)}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {formatTimestamp(product.createdAt)}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
          Xem chi tiết <FiArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
