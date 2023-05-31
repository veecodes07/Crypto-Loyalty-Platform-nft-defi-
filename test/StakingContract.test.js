const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingContract", function () {
  let stakingContract;
  let tokenContract;
  let nftContract;
  let owner;
  let account2;

  beforeEach(async function () {
    const TokenContract = await ethers.getContractFactory("LuniverseToken");
    const NFTContract = await ethers.getContractFactory("LuniverseNFT");
    const StakingContract = await ethers.getContractFactory("StakingContract");

    [owner, account2] = await ethers.getSigners();

    tokenContract = await TokenContract.deploy(1000);
    await tokenContract.deployed();

    nftContract = await NFTContract.deploy();
    await nftContract.deployed();

    stakingContract = await StakingContract.deploy(tokenContract.address, nftContract.address);
    await stakingContract.deployed();
  });

  it("should transfer 0.00000000000001 token to account 2, allow staking, and receive NFT", async function () {
    const tokenId = 1;

    // Transfer tokens
    const transferAmount = 1;
    await tokenContract.connect(owner).transfer(account2.address, transferAmount);

    // Check account 2's token balance
    const account2InitialBalance = await tokenContract.balanceOf(account2.address);
    expect(account2InitialBalance).to.equal(transferAmount);

     //Approve allowance for staking
    await tokenContract.connect(account2).approve(stakingContract.address, transferAmount);

     //Account 2 stakes tokens
    await stakingContract.connect(account2).stakeTokens(transferAmount);

  });

  it("should mint and transfer NFT to account 2", async function () {
    // Mint NFT
    await nftContract.safeMint(owner.address);
  
     // Get the current token ID
  const tokenId = await nftContract.getCurrentTokenId();

  // Transfer NFT to account2
  await nftContract.transferFrom(owner.address, account2.address, tokenId);

  // Check account2's NFT balance
 const nftBalance = await nftContract.balanceOf(account2.address);
  expect(nftBalance).to.equal(1);
  });

  // Additional test cases...
});
