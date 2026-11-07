const fs = require("fs");
const path = require("path");

async function main() {
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.waitForDeployment();

  const contractAddress = await supplyChain.getAddress();
  console.log("SupplyChain deployed to:", contractAddress);

  // Create frontend contracts directory if it doesn't exist
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Write contract address
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ address: contractAddress }, null, 2)
  );
  console.log("Contract address saved to frontend/src/contracts/contract-address.json");

  // Copy ABI
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "SupplyChain.sol",
    "SupplyChain.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  fs.writeFileSync(
    path.join(contractsDir, "SupplyChain.json"),
    JSON.stringify(artifact.abi, null, 2)
  );
  console.log("ABI saved to frontend/src/contracts/SupplyChain.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
