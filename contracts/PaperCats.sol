// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract PaperCats is ERC721Enumerable, Ownable {

    string _baseTokenURI;
    bool public _paused = true;
    uint256 private _price = 0.0005 ether;

    // community address
    address _communityWallet = 0xfc86A64a8DE22CF25410F7601AcBd8d6630Da93D;

    constructor(string memory baseURI) ERC721("Paper Cats", "PCATS")  {
        setBaseURI(baseURI);
    }

    // infinite mints, max 3 tokens per transaction
    // tiny minting price, all goes back to the community :)
    function adopt(uint256 amount) public payable {
        require(amount < 4, "You can adopt a maximum of 3 Paper Cats");
        require(!_paused, "Sale paused");
        require(msg.value == _price * amount, "Ether sent is not correct");

        for (uint256 i; i < amount; i++) {
            _safeMint(msg.sender, totalSupply());
        }
    }

    function walletOfOwner(address _owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for (uint256 i; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function pause(bool val) public onlyOwner {
        _paused = val;
    }

    function withdrawAll() public onlyOwner {
        require(payable(_communityWallet).send(address(this).balance));
    }
}