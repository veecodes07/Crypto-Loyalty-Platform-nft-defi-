const hre = require("hardhat");

const PUBLIC_KEY = process.env.PUBLIC_KEY;

async function main() {
  const LuniverseNFT = await hre.ethers.getContractFactory("LuniverseNFT");
  const luniverseNFT = await LuniverseNFT.deploy({ gasLimit: 3_000_000 });

  await luniverseNFT.deployed();

  console.log(`Contract address: ${luniverseNFT.address}`);

  const account1 = PUBLIC_KEY; // deployer
  const mintNFT = await luniverseNFT.safeMint(account1, { gasLimit: 100_000 });
  await mintNFT.wait();

  console.log(`New NFT is minted to ${account1}.`);

  const account2 = "0x162955A482a07C02d35881f68658F17816005b1A";
  const transferNFT = await luniverseNFT.transferFrom(account1, account2, 0, { gasLimit: 100_000 });
  await transferNFT.wait();

  console.log(`Minted NFT is transferred from ${account1} to ${account2}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});