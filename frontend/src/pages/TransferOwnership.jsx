import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiUser, FiPackage, FiAlertCircle } from 'react-icons/fi';
import { useWeb3 } from '../context/Web3Context';
import { getProduct, transferProductOwnership } from '../utils/contract';
import { formatAddress } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function TransferOwnership() {
  const { contract, account, connectWallet, isConnecting } = useWeb3();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [productId, setProductId] = useState(searchParams.get('id') || '');
  const [newOwner, setNewOwner] = useState('');
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [productError, setProductError] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setProductId(id);
      fetchProduct(id);
    }
    // eslint-disable-next-line
  }, [searchParams, contract]);

  async function fetchProduct(id) {
    if (!contract || !id) return;
    setLoadingProduct(true);
    setProductError('');
    setProduct(null);
    try {
      const p = await getProduct(contract, Number(id));
      setProduct(p);
    } catch {
      setProductError('Không tìm thấy sản phẩm với ID này.');
    } finally {
      setLoadingProduct(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contract || !account) return toast.error('Vui lòng kết nối ví!');
    if (!productId || !newOwner) return toast.error('Vui lòng điền đầy đủ thông tin!');
    if (!/^0x[0-9a-fA-F]{40}$/.test(newOwner)) return toast.error('Địa chỉ ví không hợp lệ!');
    if (!product) return toast.error('Vui lòng tra cứu sản phẩm trước!');
    if (product.currentOwner.toLowerCase() !== account.toLowerCase()) {
      return toast.error('Bạn không phải chủ sở hữu sản phẩm này!');
    }

    setSubmitting(true);
    try {
      await transferProductOwnership(contract, Number(productId), newOwner);
      toast.success(`✅ Chuyển quyền sở hữu thành công! Sản phẩm #${productId} đã được chuyển cho ${formatAddress(newOwner)}`);
      setNewOwner('');
      setProduct(null);
      setProductId('');
      navigate(`/track/${productId}`);
    } catch (err) {
      toast.error('Chuyển thất bại: ' + (err.reason || err.message || 'Lỗi không xác định'));
    } finally {
      setSubmitting(false);
    }
  }

  if (!account) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🦊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa kết nối ví</h2>
          <p className="text-gray-500 mb-6">Vui lòng kết nối MetaMask để chuyển quyền sở hữu.</p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isConnecting ? 'Đang kết nối...' : 'Kết nối MetaMask'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-xl">
          <FiArrowRight className="w-7 h-7 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Chuyển Quyền Sở Hữu</h1>
          <p className="text-gray-500 text-sm mt-0.5">Chuyển sản phẩm sang tay người khác trong chuỗi cung ứng</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product ID */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiPackage className="text-indigo-500" /> Thông tin sản phẩm
          </h2>
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              value={productId}
              onChange={e => setProductId(e.target.value)}
              placeholder="Nhập mã sản phẩm (ID)..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
            <button
              type="button"
              onClick={() => fetchProduct(productId)}
              disabled={loadingProduct || !productId}
              className="px-5 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-200 transition disabled:opacity-50"
            >
              Tra cứu
            </button>
          </div>

          {/* Product Preview */}
          {loadingProduct && <LoadingSpinner message="Đang tải..." />}
          {productError && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <FiAlertCircle /> {productError}
            </div>
          )}
          {product && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-800 text-lg">{product.name}</span>
                <StatusBadge statusCode={product.status} size="sm" />
              </div>
              <p className="text-sm text-gray-600">📍 {product.origin} · 🏭 {product.manufacturer}</p>
              <p className="text-sm text-gray-500">
                Chủ sở hữu:{' '}
                <span className={`font-mono font-semibold ${product.currentOwner.toLowerCase() === account.toLowerCase() ? 'text-green-600' : 'text-red-500'}`}>
                  {formatAddress(product.currentOwner)}
                  {product.currentOwner.toLowerCase() === account.toLowerCase() && ' (bạn)'}
                </span>
              </p>
              {product.currentOwner.toLowerCase() !== account.toLowerCase() && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <FiAlertCircle /> Bạn không phải chủ sở hữu sản phẩm này.
                </div>
              )}
            </div>
          )}
        </div>

        {/* New Owner */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiUser className="text-indigo-500" /> Người nhận
          </h2>
          <label className="block text-sm font-medium text-gray-600 mb-2">Địa chỉ ví người nhận</label>
          <input
            type="text"
            value={newOwner}
            onChange={e => setNewOwner(e.target.value)}
            placeholder="0x..."
            pattern="^0x[0-9a-fA-F]{40}$"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-mono text-sm"
            required
          />
          <p className="text-xs text-gray-400 mt-2">Nhập địa chỉ Ethereum hợp lệ (0x...)</p>
        </div>

        <button
          type="submit"
          disabled={submitting || !product || (product && product.currentOwner.toLowerCase() !== account.toLowerCase())}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Đang xử lý...
            </>
          ) : (
            <><FiArrowRight /> Chuyển Quyền Sở Hữu</>
          )}
        </button>
      </form>
    </div>
  );
}
