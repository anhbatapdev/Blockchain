import contractABI from '../contracts/SupplyChain.json';
import { ethers } from 'ethers';

function formatProduct(product) {
  return {
    id: Number(product.id),
    name: product.name,
    description: product.description,
    origin: product.origin,
    manufacturer: product.manufacturer,
    currentOwner: product.currentOwner,
    createdAt: Number(product.createdAt),
    status: Number(product.status),
    exists: product.exists,
  };
}

function formatHistoryEntry(entry) {
  return {
    timestamp: Number(entry.timestamp),
    actor: entry.actor,
    status: Number(entry.status),
    location: entry.location,
    details: entry.details,
  };
}

/**
 * Extract user-friendly error message from a contract transaction error.
 */
function extractErrorMessage(err) {
  // ethers v6: revert reason is in err.reason or err.revert?.args
  if (err.reason) return err.reason;
  if (err.revert?.args?.[0]) return err.revert.args[0];
  // Nested error (e.g., MetaMask wrapping)
  if (err.error?.reason) return err.error.reason;
  if (err.error?.message) return err.error.message;
  // User rejected
  if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
    return 'Giao dịch đã bị từ chối bởi người dùng.';
  }
  // Nonce issues
  if (err.code === 'NONCE_EXPIRED' || (err.message && err.message.includes('nonce'))) {
    return 'Lỗi nonce: Vui lòng reset tài khoản trong MetaMask (Settings > Advanced > Clear activity tab data).';
  }
  return err.message || 'Lỗi không xác định';
}

export async function addProduct(contract, name, description, origin, manufacturer, location, details) {
  try {
    const tx = await contract.addProduct(name, description, origin, manufacturer, location, details);
    const receipt = await tx.wait();
    return receipt;
  } catch (err) {
    const message = extractErrorMessage(err);
    const error = new Error(message);
    error.reason = message;
    throw error;
  }
}

/**
 * Parse the ProductAdded event from a transaction receipt (ethers v6).
 * Returns the product ID as a string, or null if not found.
 */
export function parseProductAddedEvent(contract, receipt) {
  try {
    if (!receipt || !receipt.logs) return null;

    // Create interface to parse logs
    const iface = contract.interface || new ethers.Interface(contractABI);

    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog({ topics: log.topics, data: log.data });
        if (parsed && parsed.name === 'ProductAdded') {
          // ProductAdded(uint256 indexed id, string name, address indexed producer)
          return parsed.args[0]?.toString() || parsed.args.id?.toString();
        }
      } catch {
        // Not our event, skip
        continue;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function updateProductStatus(contract, productId, status, location, details) {
  try {
    const tx = await contract.updateStatus(productId, status, location, details);
    const receipt = await tx.wait();
    return receipt;
  } catch (err) {
    const message = extractErrorMessage(err);
    const error = new Error(message);
    error.reason = message;
    throw error;
  }
}

export async function transferProductOwnership(contract, productId, newOwnerAddress) {
  try {
    const tx = await contract.transferOwnership(productId, newOwnerAddress);
    const receipt = await tx.wait();
    return receipt;
  } catch (err) {
    const message = extractErrorMessage(err);
    const error = new Error(message);
    error.reason = message;
    throw error;
  }
}

export async function getProduct(contract, productId) {
  const product = await contract.getProduct(productId);
  return formatProduct(product);
}

export async function getProductHistory(contract, productId) {
  const history = await contract.getProductHistory(productId);
  return history.map(formatHistoryEntry);
}

export async function getAllProducts(contract) {
  const products = await contract.getAllProducts();
  return products.map(formatProduct);
}

export async function getProductCount(contract) {
  const count = await contract.productCount();
  return Number(count);
}

export async function assignRole(contract, address, role) {
  try {
    const tx = await contract.assignRole(address, role);
    const receipt = await tx.wait();
    return receipt;
  } catch (err) {
    const message = extractErrorMessage(err);
    const error = new Error(message);
    error.reason = message;
    throw error;
  }
}
