import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiPlus, FiSearch, FiList } from 'react-icons/fi';
import { useWeb3 } from '../context/Web3Context';
import { formatAddress } from '../utils/helpers';

const navLinks = [
  { to: '/', label: 'Trang chủ', icon: FiHome },
  { to: '/add', label: 'Thêm sản phẩm', icon: FiPlus },
  { to: '/track', label: 'Tra cứu', icon: FiSearch },
  { to: '/dashboard', label: 'Dashboard', icon: FiList },
];

const Navbar = () => {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🔗</span>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SupplyChain
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-indigo-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Wallet + mobile toggle */}
          <div className="flex items-center gap-3">
            {account ? (
              <button
                onClick={disconnectWallet}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {formatAddress(account)}
              </button>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="inline-flex px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {isConnecting ? 'Đang kết nối...' : 'Kết nối ví'}
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-gray-100">
              {account ? (
                <button
                  onClick={() => { disconnectWallet(); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 bg-gray-100 rounded-xl text-sm font-medium text-gray-700"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {formatAddress(account)}
                </button>
              ) : (
                <button
                  onClick={() => { connectWallet(); setMobileOpen(false); }}
                  disabled={isConnecting}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isConnecting ? 'Đang kết nối...' : 'Kết nối ví'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
