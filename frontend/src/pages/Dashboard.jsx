import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiShoppingBag, FiRefreshCw, FiPlus, FiBarChart2 } from 'react-icons/fi';
import { useWeb3 } from '../context/Web3Context';
import { getAllProducts, getProductCount } from '../utils/contract';
import { getStatusInfo } from '../utils/helpers';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { contract, account, connectWallet, isConnecting } = useWeb3();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, inTransit: 0, delivered: 0, sold: 0 });
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const all = await getAllProducts(contract);
      setProducts(all);
      setStats({
        total: all.length,
        inTransit: all.filter(p => p.status === 3 || p.status === 4).length,
        delivered: all.filter(p => p.status === 5).length,
        sold: all.filter(p => p.status === 7).length,
      });
    } catch (err) {
      toast.error('Không thể tải danh sách sản phẩm: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!account) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🦊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa kết nối ví</h2>
          <p className="text-gray-500 mb-6">Vui lòng kết nối MetaMask để xem dashboard.</p>
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

  const statCards = [
    { label: 'Tổng sản phẩm', value: stats.total, icon: <FiPackage className="w-7 h-7" />, color: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { label: 'Đang vận chuyển', value: stats.inTransit, icon: <FiTruck className="w-7 h-7" />, color: 'from-orange-400 to-amber-500', bg: 'bg-orange-50', text: 'text-orange-600' },
    { label: 'Đã giao hàng', value: stats.delivered, icon: <FiCheckCircle className="w-7 h-7" />, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', text: 'text-green-600' },
    { label: 'Đã bán', value: stats.sold, icon: <FiShoppingBag className="w-7 h-7" />, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', text: 'text-pink-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <FiBarChart2 className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Tổng quan chuỗi cung ứng</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition font-medium disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <Link
            to="/add"
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <FiPlus className="w-4 h-4" />
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-200">
            <div className={`w-12 h-12 ${s.bg} ${s.text} rounded-xl flex items-center justify-center`}>
              {s.icon}
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{s.value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
            </div>
            <div className={`h-1 rounded-full bg-gradient-to-r ${s.color}`} />
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiPackage className="w-5 h-5 text-indigo-600" />
          Danh sách sản phẩm
        </h2>

        {loading ? (
          <LoadingSpinner message="Đang tải sản phẩm..." />
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">Chưa có sản phẩm nào.</p>
            <Link
              to="/add"
              className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <FiPlus className="w-4 h-4" /> Thêm sản phẩm đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/track/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
