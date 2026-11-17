const { ethers } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();
  const mnemonic = "test test test test test test test test test test test junk";

  console.log("\n================ DANH SÁCH VÍ TEST HARDHAT ================\n");
  for (let i = 0; i < signers.length; i++) {
    const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, "", `m/44'/60'/0'/0/${i}`);
    console.log(`Account #${i}: ${signers[i].address}`);
    console.log(`Private Key: ${wallet.privateKey}`);
    console.log("------------------------------------------------------------");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
