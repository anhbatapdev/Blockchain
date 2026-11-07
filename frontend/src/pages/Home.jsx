import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiList, FiShield, FiTruck, FiCheck } from 'react-icons/fi';

const Home = () => {
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/track/${searchId.trim()}`);
    }
  };

  const features = [
    {
      icon: '🔒',
      title: 'Bảo mật Blockchain',
      description:
        'Dữ liệu được lưu trữ trên blockchain, không thể bị giả mạo hay thay đổi. Đảm bảo tính minh bạch và an toàn tuyệt đối.',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: '📍',
      title: 'Theo dõi thời gian thực',
      description:
        'Theo dõi hành trình sản phẩm từ sản xuất đến tay người tiêu dùng một cách chi tiết và chính xác.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '✅',
      title: 'Xác thực nguồn gốc',
      description:
        'Xác minh nguồn gốc sản phẩm dễ dàng thông qua mã sản phẩm hoặc quét mã QR.',
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  const steps = [
    { num: 1, label: 'Đăng ký sản phẩm', icon: <FiPlus className="w-6 h-6" /> },
    { num: 2, label: 'Cập nhật trạng thái', icon: <FiShield className="w-6 h-6" /> },
    { num: 3, label: 'Vận chuyển & Phân phối', icon: <FiTruck className="w-6 h-6" /> },
    { num: 4, label: 'Người dùng tra cứu', icon: <FiCheck className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Truy Xuất Nguồn Gốc
            <br />
            <span className="text-indigo-200">Sản Phẩm</span>
          </h1>
          <p className="text-lg sm:text-xl text-indigo-200 font-medium mb-3">
            Minh bạch &bull; Tin cậy &bull; Không thể giả mạo
          </p>
          <p className="max-w-2xl mx-auto text-indigo-100/80 mb-10">
            Nền tảng truy xuất nguồn gốc sản phẩm trên Blockchain giúp đảm bảo
            tính minh bạch trong chuỗi cung ứng, từ nhà sản xuất đến tay người
            tiêu dùng.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto mb-8"
          >
            <div className="relative w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Nhập mã sản phẩm để tra cứu..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 outline-none shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FiSearch className="w-5 h-5" />
              Tra cứu
            </button>
          </form>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/add"
              className="px-6 py-3 rounded-xl font-semibold bg-white text-indigo-700 shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-200 flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Thêm sản phẩm
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl font-semibold border-2 border-white/40 text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
            >
              <FiList className="w-5 h-5" />
              Xem Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Tại sao chọn chúng tôi?
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
          Giải pháp truy xuất nguồn gốc tiên tiến trên nền tảng Blockchain
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-200 border border-gray-100 group"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} text-white text-3xl mb-5 group-hover:scale-110 transition-transform`}
              >
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-indigo-50/60 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Quy trình hoạt động
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            4 bước đơn giản để truy xuất nguồn gốc sản phẩm
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center group">
                {/* Arrow between steps (hidden on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 text-indigo-300 text-2xl">
                    →
                  </div>
                )}

                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-lg font-bold">{s.num}</span>
                </div>
                <div className="flex justify-center mb-3 text-indigo-600">{s.icon}</div>
                <h4 className="font-semibold text-gray-900">{s.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
