// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LuniverseNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("LuniverseNFT", "LNFT") {}

    function safeMint(address to) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
}

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "LuniverseNFT: transfer caller is not owner nor approved"
        );
        _transfer(from, to, tokenId);
    }

      function getCurrentTokenId() public view returns (uint256) {
  return _tokenIdCounter.current() - 1;
}

}
