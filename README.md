# 🔗 Truy Xuất Nguồn Gốc Sản Phẩm - Blockchain DApp

Ứng dụng web phi tập trung (DApp) giúp truy xuất nguồn gốc sản phẩm minh bạch, tin cậy trên nền tảng blockchain Ethereum.

## ✨ Tính Năng

- 📋 **Thêm sản phẩm**: Đăng ký sản phẩm mới lên blockchain
- 🔍 **Tra cứu nguồn gốc**: Xem toàn bộ hành trình sản phẩm qua timeline
- 🔄 **Cập nhật trạng thái**: Sản xuất → Đóng gói → Vận chuyển → Giao hàng → Bán
- 🔁 **Chuyển quyền sở hữu**: Chuyển sản phẩm giữa các bên trong chuỗi cung ứng
- 📊 **Dashboard**: Thống kê tổng quan tất cả sản phẩm
- 📱 **QR Code**: Tạo mã QR cho mỗi sản phẩm để tra cứu nhanh

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity 0.8.20 |
| Blockchain | Hardhat Network (local) |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Web3 | Ethers.js v6 |
| Wallet | MetaMask |

## 🚀 Hướng Dẫn Chạy

### Yêu Cầu
- Node.js >= 18
- MetaMask extension trên trình duyệt

### Bước 1: Cài dependencies
```bash
# Tại thư mục gốc (Hardhat)
npm install

# Tại thư mục frontend
cd frontend
npm install
```

### Bước 2: Khởi động Hardhat local node
Mở **Terminal 1**:
```bash
cd d:\Blockchain
npx hardhat node
```
> Giữ terminal này mở. Hardhat sẽ hiển thị 20 tài khoản test với 10000 ETH mỗi tài khoản.

### Bước 3: Deploy smart contract
Mở **Terminal 2**:
```bash
cd d:\Blockchain
npx hardhat run scripts/deploy.js --network localhost
```
> Script sẽ tự động copy ABI và địa chỉ contract vào `frontend/src/contracts/`

### Bước 4: Khởi động frontend
```bash
cd d:\Blockchain\frontend
npm run dev
```
> Mở trình duyệt tại: http://localhost:5173

### Bước 5: Cấu hình MetaMask
1. Mở MetaMask → Add network manually:
   - **Network name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency**: ETH
2. Import một account test từ Terminal 1 (copy private key của Account #0)

## 📁 Cấu Trúc Thư Mục

```
d:\Blockchain\
├── contracts/
│   └── SupplyChain.sol      # Smart contract chính
├── scripts/
│   └── deploy.js            # Script deploy contract
├── test/
│   └── SupplyChain.test.js  # Unit tests
├── frontend/
│   └── src/
│       ├── components/      # UI components tái sử dụng
│       ├── context/         # Web3 context (kết nối ví)
│       ├── pages/           # Các trang của ứng dụng
│       ├── utils/           # Helper functions
│       └── contracts/       # ABI + địa chỉ contract (auto-generated)
├── hardhat.config.js
└── package.json
```

## 🧪 Chạy Tests
```bash
cd d:\Blockchain
npx hardhat test
```
