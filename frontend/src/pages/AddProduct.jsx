import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useWeb3 } from '../context/Web3Context';
import { addProduct } from '../utils/contract';
import LoadingSpinner from '../components/LoadingSpinner';

const AddProduct = () => {
  const { account, contract, connectWallet, isConnecting } = useWeb3();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    origin: '',
    manufacturer: '',
    location: '',
    details: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.origin || !form.manufacturer || !form.location) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    setLoading(true);
    try {
      const tx = await addProduct(
        contract,
        form.name,
        form.description,
        form.origin,
        form.manufacturer,
        form.location,
        form.details
      );

      // Try to extract product ID from events
      let productId;
      if (tx && tx.events) {
        const event = tx.events.ProductCreated || tx.events[0];
        if (event && event.args) {
          productId = event.args.productId?.toString() || event.args[0]?.toString();
        }
      }

      toast.success(
        productId
          ? `Thêm sản phẩm thành công! Mã SP: #${productId}`
          : 'Thêm sản phẩm thành công!',
        { duration: 5000 }
      );

      if (productId) {
        const goTrack = window.confirm(
          `Sản phẩm #${productId} đã được tạo. Bạn có muốn xem chi tiết?`
        );
        if (goTrack) {
          navigate(`/track/${productId}`);
          return;
        }
      }

      setForm({ name: '', description: '', origin: '', manufacturer: '', location: '', details: '' });
    } catch (err) {
      console.error(err);
      toast.error(err?.reason || err?.message || 'Có lỗi xảy ra khi thêm sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  /* ---- Wallet not connected ---- */
  if (!account) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kết nối ví của bạn</h2>
          <p className="text-gray-500 mb-6">
            Bạn cần kết nối ví MetaMask để thêm sản phẩm mới lên blockchain.
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
          >
            {isConnecting ? 'Đang kết nối...' : 'Kết nối ví'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
            <FiPackage className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thêm Sản Phẩm Mới</h1>
            <p className="text-sm text-gray-500">Đăng ký sản phẩm lên blockchain</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loading ? (
            <LoadingSpinner message="Đang gửi giao dịch lên blockchain..." />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="VD: Gạo ST25"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                  required
                />
              </div>

              {/* Xuất xứ + Nhà SX */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xuất xứ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    placeholder="VD: Sóc Trăng, Việt Nam"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhà sản xuất <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={form.manufacturer}
                    onChange={handleChange}
                    placeholder="VD: Công ty ABC"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Địa điểm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Địa điểm hiện tại của sản phẩm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
              </div>

              {/* Chi tiết bổ sung */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chi tiết bổ sung
                </label>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Thông tin thêm (không bắt buộc)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                Thêm sản phẩm
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
