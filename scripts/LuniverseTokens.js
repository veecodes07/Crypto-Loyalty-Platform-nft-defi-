const hre = require("hardhat");

const PUBLIC_KEY = process.env.PUBLIC_KEY;

async function main() {
  const LuniverseToken = await hre.ethers.getContractFactory("LuniverseToken");
  const luniverseToken = await LuniverseToken.deploy(1_000_000, { gasLimit: 3_000_000 });

  await luniverseToken.deployed();

  console.log(`Contract address: ${luniverseToken.address}`);

  const account1 = PUBLIC_KEY; // deployer
  const account2 = "0x162955A482a07C02d35881f68658F17816005b1A";
  const transferToken = await luniverseToken.transfer(account2, 10000, { gasLimit: 100_000 });
  await transferToken.wait();

  console.log(`A Token is transferred from ${account1} to ${account2}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});