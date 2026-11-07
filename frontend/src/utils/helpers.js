export const STATUS_LIST = [
  { code: 0, label: 'Đã tạo', labelEn: 'Created', color: 'gray', icon: '📋' },
  { code: 1, label: 'Đang sản xuất', labelEn: 'InProduction', color: 'yellow', icon: '🏭' },
  { code: 2, label: 'Đã đóng gói', labelEn: 'Packaged', color: 'blue', icon: '📦' },
  { code: 3, label: 'Đã gửi hàng', labelEn: 'Shipped', color: 'purple', icon: '🚚' },
  { code: 4, label: 'Đang vận chuyển', labelEn: 'InTransit', color: 'orange', icon: '✈️' },
  { code: 5, label: 'Đã giao hàng', labelEn: 'Delivered', color: 'green', icon: '✅' },
  { code: 6, label: 'Tại cửa hàng', labelEn: 'InStore', color: 'teal', icon: '🏪' },
  { code: 7, label: 'Đã bán', labelEn: 'Sold', color: 'emerald', icon: '🎉' },
];

export function getStatusInfo(statusCode) {
  const code = Number(statusCode);
  return STATUS_LIST.find((s) => s.code === code) || STATUS_LIST[0];
}

export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const ts = Number(timestamp);
  const date = new Date(ts * 1000);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function getStatusColorClasses(statusCode) {
  const code = Number(statusCode);
  const colorMap = {
    0: 'bg-gray-100 text-gray-800',
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-purple-100 text-purple-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-green-100 text-green-800',
    6: 'bg-teal-100 text-teal-800',
    7: 'bg-emerald-100 text-emerald-800',
  };
  return colorMap[code] || 'bg-gray-100 text-gray-800';
}
