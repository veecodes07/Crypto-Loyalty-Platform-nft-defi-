// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./LuniverseNFT.sol";
import "./LuniverseTokens.sol";




contract StakingContract {
    LuniverseToken private token;
    LuniverseNFT private nft;

    struct Stake {
        uint256 amount;
        bool isNFTReceived;
    }

    mapping(address => Stake) public stakers;

    constructor(address tokenAddress, address nftAddress) {
        token = LuniverseToken(tokenAddress);
        nft = LuniverseNFT(nftAddress);
    }

    function stakeTokens(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        token.transferFrom(msg.sender, address(this), amount);
        stakers[msg.sender] = Stake(amount, false);
    }

    function receiveNFT() external {
        Stake storage staker = stakers[msg.sender];
        require(staker.amount > 0, "No tokens staked");
        require(!staker.isNFTReceived, "NFT already received");
        staker.isNFTReceived = true;
        nft.safeMint(msg.sender);
    }

    function withdrawTokens() external {
        Stake storage staker = stakers[msg.sender];
        require(staker.amount > 0, "No tokens staked");
        token.transfer(msg.sender, staker.amount);
        staker.amount = 0;
    }
}
