const hre = require("hardhat");

async function main() {
  const ownerShipToken = await hre.ethers.getContractFactory("OwnerShipTokens");
  const ownerShipTokenInstance = await ownerShipToken.deploy("Cluster Protocol","CLP");

  await ownerShipTokenInstance.deployed();

  console.log("Ownership token contract address !! ", ownerShipTokenInstance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
