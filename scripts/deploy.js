const { ethers } = require("hardhat");

async function deployContracts() {
  // Deploy LuniverseNFT contract
  const LuniverseNFT = await ethers.getContractFactory("LuniverseNFT");
  const luniverseNFT = await LuniverseNFT.deploy();
  await luniverseNFT.deployed();
  console.log("LuniverseNFT deployed to:", luniverseNFT.address);

  // Deploy LuniverseToken contract
  const LuniverseToken = await ethers.getContractFactory("LuniverseToken");
  const luniverseToken = await LuniverseToken.deploy(1000000);
  await luniverseToken.deployed();
  console.log("LuniverseToken deployed to:", luniverseToken.address);

  // Deploy StakingContract
  const StakingContract = await ethers.getContractFactory("StakingContract");
  const stakingContract = await StakingContract.deploy(luniverseToken.address, luniverseNFT.address);
  await stakingContract.deployed();
  console.log("StakingContract deployed to:", stakingContract.address);
}

deployContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
