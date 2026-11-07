const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SupplyChain", function () {
  async function deploySupplyChainFixture() {
    const [owner, producer, distributor, retailer, other] =
      await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();

    return { supplyChain, owner, producer, distributor, retailer, other };
  }

  async function deployWithProductFixture() {
    const { supplyChain, owner, producer, distributor, retailer, other } =
      await loadFixture(deploySupplyChainFixture);

    await supplyChain.addProduct(
      "Test Product",
      "A test product description",
      "Test Origin",
      "Test Manufacturer",
      "Factory A",
      "Product created for testing"
    );

    return { supplyChain, owner, producer, distributor, retailer, other };
  }

  describe("Deployment", function () {
    it("should set correct owner", async function () {
      const { supplyChain, owner } = await loadFixture(
        deploySupplyChainFixture
      );
      expect(await supplyChain.owner()).to.equal(owner.address);
    });
  });

  describe("Add Product", function () {
    it("should add product and emit event", async function () {
      const { supplyChain, owner } = await loadFixture(
        deploySupplyChainFixture
      );

      await expect(
        supplyChain.addProduct(
          "Test Product",
          "A test product description",
          "Test Origin",
          "Test Manufacturer",
          "Factory A",
          "Product created"
        )
      )
        .to.emit(supplyChain, "ProductAdded")
        .withArgs(1, "Test Product", owner.address);

      const product = await supplyChain.getProduct(1);
      expect(product.name).to.equal("Test Product");
      expect(product.description).to.equal("A test product description");
      expect(product.origin).to.equal("Test Origin");
      expect(product.manufacturer).to.equal("Test Manufacturer");
      expect(product.currentOwner).to.equal(owner.address);
      expect(product.status).to.equal(0); // Status.Created
      expect(product.exists).to.equal(true);
    });

    it("should increment product count", async function () {
      const { supplyChain } = await loadFixture(deploySupplyChainFixture);

      expect(await supplyChain.productCount()).to.equal(0);

      await supplyChain.addProduct(
        "Product 1",
        "Desc 1",
        "Origin 1",
        "Manufacturer 1",
        "Location 1",
        "Details 1"
      );
      expect(await supplyChain.productCount()).to.equal(1);

      await supplyChain.addProduct(
        "Product 2",
        "Desc 2",
        "Origin 2",
        "Manufacturer 2",
        "Location 2",
        "Details 2"
      );
      expect(await supplyChain.productCount()).to.equal(2);
    });
  });

  describe("Update Status", function () {
    it("should update status", async function () {
      const { supplyChain, owner } = await loadFixture(
        deployWithProductFixture
      );

      await expect(
        supplyChain.updateStatus(1, 1, "Production Line", "Started production")
      )
        .to.emit(supplyChain, "StatusUpdated")
        .withArgs(1, 1, owner.address);

      const product = await supplyChain.getProduct(1);
      expect(product.status).to.equal(1); // Status.InProduction
    });

    it("should reject non-owner update", async function () {
      const { supplyChain, other } = await loadFixture(
        deployWithProductFixture
      );

      await expect(
        supplyChain
          .connect(other)
          .updateStatus(1, 1, "Production Line", "Started production")
      ).to.be.revertedWith("Only current owner can update status");
    });
  });

  describe("Transfer Ownership", function () {
    it("should transfer and emit event", async function () {
      const { supplyChain, owner, distributor } = await loadFixture(
        deployWithProductFixture
      );

      await expect(supplyChain.transferOwnership(1, distributor.address))
        .to.emit(supplyChain, "OwnershipTransferred")
        .withArgs(1, owner.address, distributor.address);

      const product = await supplyChain.getProduct(1);
      expect(product.currentOwner).to.equal(distributor.address);
    });

    it("should reject non-owner transfer", async function () {
      const { supplyChain, other, distributor } = await loadFixture(
        deployWithProductFixture
      );

      await expect(
        supplyChain.connect(other).transferOwnership(1, distributor.address)
      ).to.be.revertedWith("Only current owner can transfer ownership");
    });
  });

  describe("Get Product History", function () {
    it("should return correct history entries", async function () {
      const { supplyChain, owner } = await loadFixture(
        deployWithProductFixture
      );

      // Initial creation adds 1 history entry
      let history = await supplyChain.getProductHistory(1);
      expect(history.length).to.equal(1);
      expect(history[0].actor).to.equal(owner.address);
      expect(history[0].status).to.equal(0); // Status.Created
      expect(history[0].location).to.equal("Factory A");
      expect(history[0].details).to.equal("Product created for testing");

      // Update status adds another entry
      await supplyChain.updateStatus(
        1,
        1,
        "Production Line",
        "Started production"
      );
      history = await supplyChain.getProductHistory(1);
      expect(history.length).to.equal(2);
      expect(history[1].status).to.equal(1); // Status.InProduction
      expect(history[1].location).to.equal("Production Line");

      // Check history count
      expect(await supplyChain.getHistoryCount(1)).to.equal(2);
    });
  });

  describe("Assign Role", function () {
    it("should assign role", async function () {
      const { supplyChain, producer } = await loadFixture(
        deploySupplyChainFixture
      );

      await expect(supplyChain.assignRole(producer.address, 1))
        .to.emit(supplyChain, "RoleAssigned")
        .withArgs(producer.address, 1);

      expect(await supplyChain.roles(producer.address)).to.equal(1); // Role.Producer
    });

    it("should reject non-owner assigning role", async function () {
      const { supplyChain, other, producer } = await loadFixture(
        deploySupplyChainFixture
      );

      await expect(
        supplyChain.connect(other).assignRole(producer.address, 1)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });
});
