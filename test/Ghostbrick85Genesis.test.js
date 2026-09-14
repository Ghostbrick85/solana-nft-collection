const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ghostbrick85Genesis", function () {
  async function deploy() {
    const [owner, collector, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("Ghostbrick85Genesis");
    const nft = await Factory.deploy("ipfs://metadata/", owner.address, 500);
    return { nft, owner, collector, other };
  }

  it("mints sequential tokens with correct metadata", async function () {
    const { nft, collector } = await deploy();
    await nft.mint(collector.address, 2);
    expect(await nft.totalSupply()).to.equal(2);
    expect(await nft.ownerOf(1)).to.equal(collector.address);
    expect(await nft.tokenURI(2)).to.equal("ipfs://metadata/2.json");
  });

  it("enforces owner-only minting and the ten-token cap", async function () {
    const { nft, collector, other } = await deploy();
    await expect(nft.connect(other).mint(other.address, 1)).to.be.reverted;
    await nft.mint(collector.address, 10);
    await expect(nft.mint(collector.address, 1)).to.be.revertedWithCustomError(nft, "MaxSupplyExceeded");
  });

  it("reports a five-percent ERC-2981 royalty", async function () {
    const { nft, owner } = await deploy();
    const [receiver, amount] = await nft.royaltyInfo(1, 10_000);
    expect(receiver).to.equal(owner.address);
    expect(amount).to.equal(500);
  });

  it("blocks minting and transfers while paused", async function () {
    const { nft, collector, other } = await deploy();
    await nft.mint(collector.address, 1);
    await nft.pause();
    await expect(nft.mint(collector.address, 1)).to.be.reverted;
    await expect(nft.connect(collector).transferFrom(collector.address, other.address, 1)).to.be.reverted;
  });
});
