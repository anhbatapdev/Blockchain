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

export async function addProduct(contract, name, description, origin, manufacturer, location, details) {
  const tx = await contract.addProduct(name, description, origin, manufacturer, location, details);
  const receipt = await tx.wait();
  return receipt;
}

export async function updateProductStatus(contract, productId, status, location, details) {
  const tx = await contract.updateStatus(productId, status, location, details);
  const receipt = await tx.wait();
  return receipt;
}

export async function transferProductOwnership(contract, productId, newOwnerAddress) {
  const tx = await contract.transferOwnership(productId, newOwnerAddress);
  const receipt = await tx.wait();
  return receipt;
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
  const tx = await contract.assignRole(address, role);
  const receipt = await tx.wait();
  return receipt;
}
