import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FiCamera, FiX } from 'react-icons/fi';

export default function QRScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const scannerId = 'qr-scanner-region';
    const html5Qr = new Html5Qrcode(scannerId);
    html5QrRef.current = html5Qr;

    html5Qr
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Tìm product ID từ URL hoặc text
          let productId = null;

          // Nếu là URL dạng .../track/123
          const match = decodedText.match(/\/track\/(\d+)/);
          if (match) {
            productId = match[1];
          } else if (/^\d+$/.test(decodedText.trim())) {
            // Nếu chỉ là số
            productId = decodedText.trim();
          }

          if (productId) {
            html5Qr.stop().catch(() => {});
            onScan(productId);
          }
        },
        () => {} // Ignore scan failures
      )
      .catch((err) => {
        console.error('QR Scanner error:', err);
        setError('Không thể mở camera. Vui lòng cho phép truy cập camera.');
      });

    return () => {
      html5Qr.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FiCamera className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-800">Quét mã QR</h3>
          </div>
          <button
            onClick={() => {
              if (html5QrRef.current) html5QrRef.current.stop().catch(() => {});
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scanner */}
        <div className="p-4">
          <div
            id="qr-scanner-region"
            ref={scannerRef}
            className="w-full rounded-xl overflow-hidden"
          />

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <p className="text-center text-sm text-gray-400 mt-3">
            Hướng camera vào mã QR trên sản phẩm
          </p>
        </div>
      </div>
    </div>
  );
}
