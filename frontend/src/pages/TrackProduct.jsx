import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiCopy, FiCheck, FiRefreshCw, FiExternalLink, FiPackage } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { useWeb3 } from '../context/Web3Context';
import { getProduct, getProductHistory, getAllProducts } from '../utils/contract';
import { formatAddress, formatTimestamp } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import LoadingSpinner from '../components/LoadingSpinner';
import contractAddressData from '../contracts/contract-address.json';
import contractABI from '../contracts/SupplyChain.json';

const TrackProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account, contract } = useWeb3();

  const [searchId, setSearchId] = useState(id || '');
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Danh sách tất cả sản phẩm để chọn nhanh
  const [allProducts, setAllProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Tạo read-only contract (không cần MetaMask)
  const readOnlyContract = useMemo(() => {
    try {
      // Dùng hostname hiện tại để điện thoại cũng kết nối được
      const rpcHost = window.location.hostname || '127.0.0.1';
      const provider = new ethers.JsonRpcProvider(`http://${rpcHost}:8545`);
      return new ethers.Contract(contractAddressData.address, contractABI, provider);
    } catch {
      return null;
    }
  }, []);

  // Dùng contract từ Web3 nếu đã kết nối, nếu chưa thì dùng readOnly
  const activeContract = contract || readOnlyContract;

  const fetchProduct = useCallback(
    async (productId) => {
      if (!activeContract) return;
      setLoading(true);
      setError('');
      setProduct(null);
      setHistory([]);
      try {
        const prod = await getProduct(activeContract, productId);
        if (!prod || !prod.exists) {
          setError('Không tìm thấy sản phẩm với mã này.');
          return;
        }
        setProduct(prod);

        const hist = await getProductHistory(activeContract, productId);
        setHistory(hist || []);
      } catch (err) {
        console.error(err);
        setError(err?.reason || err?.message || 'Lỗi khi tra cứu sản phẩm.');
      } finally {
        setLoading(false);
      }
    },
    [activeContract]
  );

  // Load danh sách sản phẩm
  const fetchAllProducts = useCallback(async () => {
    if (!activeContract) return;
    setLoadingList(true);
    try {
      const products = await getAllProducts(activeContract);
      setAllProducts(products);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoadingList(false);
    }
  }, [activeContract]);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Auto-search when url param present
  useEffect(() => {
    if (id && activeContract) {
      setSearchId(id);
      fetchProduct(id);
    }
  }, [id, activeContract, fetchProduct]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    navigate(`/track/${searchId.trim()}`);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Đã sao chép!');
    setTimeout(() => setCopied(false), 2000);
  };

  const isOwner =
    product && account && product.currentOwner?.toLowerCase() === account.toLowerCase();

  // Lọc sản phẩm theo tên hoặc ID
  const filteredProducts = allProducts.filter(p => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.manufacturer.toLowerCase().includes(q) ||
      p.origin.toLowerCase().includes(q) ||
      p.id.toString() === q
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Search bar */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiSearch className="w-6 h-6 text-indigo-600" />
            Tra Cứu Sản Phẩm
          </h1>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Nhập mã sản phẩm (ID)..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              Tra cứu
            </button>
          </form>
        </div>

        {/* Danh sách sản phẩm - hiện khi chưa search */}
        {!product && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FiPackage className="text-indigo-500" />
                Chọn sản phẩm để tra cứu
              </h2>
              <span className="text-sm text-gray-400">{allProducts.length} sản phẩm</span>
            </div>

            {/* Tìm kiếm theo tên */}
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="🔍 Tìm theo tên, nhà sản xuất, xuất xứ..."
              className="w-full px-4 py-3 mb-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-gray-50"
            />

            {loadingList ? (
              <LoadingSpinner message="Đang tải danh sách..." />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-gray-500">{allProducts.length === 0 ? 'Chưa có sản phẩm nào. Hãy thêm sản phẩm trước!' : 'Không tìm thấy sản phẩm phù hợp.'}</p>
                {allProducts.length === 0 && (
                  <Link to="/add" className="inline-block mt-3 px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
                    + Thêm sản phẩm
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/track/${p.id}`)}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl transition-all duration-200 text-left group border border-transparent hover:border-indigo-200"
                  >
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                      #{p.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 group-hover:text-indigo-700 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate">📍 {p.origin} · 🏭 {p.manufacturer}</p>
                    </div>
                    <StatusBadge statusCode={p.status} size="sm" />
                    <FiSearch className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner message="Đang tra cứu sản phẩm..." />}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => { setError(''); setProduct(null); }}
              className="mt-3 px-5 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-xl font-semibold hover:bg-indigo-100 transition"
            >
              ← Quay lại danh sách
            </button>
          </div>
        )}

        {/* Product info */}
        {product && !loading && (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => { setProduct(null); setHistory([]); setError(''); setSearchId(''); navigate('/track'); }}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              ← Quay lại danh sách sản phẩm
            </button>

            {/* Main info card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        Mã SP: #{product.id?.toString()}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 mt-2">
                        {product.name}
                      </h2>
                    </div>
                    <StatusBadge statusCode={product.status} size="lg" />
                  </div>

                  <p className="text-gray-600 mb-4">{product.description}</p>

                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <span className="text-gray-400 font-medium">Xuất xứ</span>
                      <p className="text-gray-900 font-semibold">{product.origin}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <span className="text-gray-400 font-medium">Nhà sản xuất</span>
                      <p className="text-gray-900 font-semibold">{product.manufacturer}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <span className="text-gray-400 font-medium">Chủ sở hữu hiện tại</span>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900 font-semibold font-mono text-xs">
                          {formatAddress(product.currentOwner)}
                        </p>
                        <button
                          onClick={() => handleCopy(product.currentOwner)}
                          className="text-gray-400 hover:text-indigo-600 transition"
                        >
                          {copied ? (
                            <FiCheck className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <FiCopy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <span className="text-gray-400 font-medium">Ngày tạo</span>
                      <p className="text-gray-900 font-semibold">
                        {formatTimestamp(product.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: QR */}
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 lg:w-48 shrink-0">
                  <QRCodeSVG
                    value={`http://192.168.1.20:5174/track/${product.id}`}
                    size={140}
                    level="M"
                    includeMargin
                  />
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Quét mã QR để tra cứu
                  </p>
                </div>
              </div>

              {/* Action buttons for owner */}
              {isOwner && (
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                  <Link
                    to={`/update-status?id=${product.id}`}
                    className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 text-sm"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    Cập nhật trạng thái
                  </Link>
                  <Link
                    to={`/transfer?id=${product.id}`}
                    className="px-5 py-2.5 rounded-xl font-semibold border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 flex items-center gap-2 text-sm"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Chuyển quyền sở hữu
                  </Link>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                📦 Hành trình sản phẩm
              </h3>
              <Timeline history={history} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackProduct;
