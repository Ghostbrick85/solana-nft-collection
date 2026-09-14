const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) throw new Error("No deployer configured. Add DEPLOYER_PRIVATE_KEY to .env.");

  const royaltyReceiver = process.env.ROYALTY_RECEIVER || deployer.address;
  const royaltyBps = Number(process.env.ROYALTY_BPS || "500");
  const baseTokenURI = process.env.BASE_TOKEN_URI;
  if (!baseTokenURI || baseTokenURI.includes("REPLACE_")) {
    throw new Error("Set BASE_TOKEN_URI to the final metadata IPFS URI before deployment.");
  }

  const Factory = await hre.ethers.getContractFactory("Ghostbrick85Genesis");
  const contract = await Factory.deploy(baseTokenURI, royaltyReceiver, royaltyBps);
  await contract.waitForDeployment();

  const network = await hre.ethers.provider.getNetwork();
  const record = {
    contract: "Ghostbrick85Genesis",
    address: await contract.getAddress(),
    deployer: deployer.address,
    royaltyReceiver,
    royaltyBps,
    baseTokenURI,
    chainId: network.chainId.toString(),
    deployedAt: new Date().toISOString(),
  };
  fs.mkdirSync(path.join(__dirname, "..", "deployments"), { recursive: true });
  fs.writeFileSync(path.join(__dirname, "..", "deployments", `${hre.network.name}.json`), JSON.stringify(record, null, 2));
  console.log(JSON.stringify(record, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
