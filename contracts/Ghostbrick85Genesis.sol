// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/// @title Ghostbrick85 Urban Underground Genesis
/// @notice A fixed 10-token ERC-721 collection for X Layer.
contract Ghostbrick85Genesis is ERC721Enumerable, ERC2981, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 10;
    uint96 public constant MAX_ROYALTY_BPS = 1_000; // 10%
    string private baseTokenURI;

    error InvalidAddress();
    error InvalidQuantity();
    error MaxSupplyExceeded();
    error RoyaltyTooHigh();

    constructor(
        string memory initialBaseURI,
        address royaltyReceiver,
        uint96 royaltyFeeNumerator
    ) ERC721("Ghostbrick85 Urban Underground Genesis", "GBUG") Ownable(msg.sender) {
        if (royaltyReceiver == address(0)) revert InvalidAddress();
        if (royaltyFeeNumerator > MAX_ROYALTY_BPS) revert RoyaltyTooHigh();
        baseTokenURI = initialBaseURI;
        _setDefaultRoyalty(royaltyReceiver, royaltyFeeNumerator);
    }

    function mint(address to, uint256 quantity) external onlyOwner whenNotPaused {
        if (to == address(0)) revert InvalidAddress();
        if (quantity == 0) revert InvalidQuantity();
        uint256 minted = totalSupply();
        if (minted + quantity > MAX_SUPPLY) revert MaxSupplyExceeded();
        for (uint256 i; i < quantity; ++i) {
            _safeMint(to, minted + i + 1);
        }
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        baseTokenURI = newBaseURI;
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        if (receiver == address(0)) revert InvalidAddress();
        if (feeNumerator > MAX_ROYALTY_BPS) revert RoyaltyTooHigh();
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
    function _baseURI() internal view override returns (string memory) { return baseTokenURI; }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string.concat(baseTokenURI, _toString(tokenId), ".json");
    }

    function _update(address to, uint256 tokenId, address auth)
        internal override(ERC721Enumerable) whenNotPaused returns (address)
    { return super._update(to, tokenId, auth); }

    function _increaseBalance(address account, uint128 value)
        internal override(ERC721Enumerable)
    { super._increaseBalance(account, value); }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721Enumerable, ERC2981) returns (bool)
    { return super.supportsInterface(interfaceId); }

    function _toString(uint256 value) private pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value; uint256 digits;
        while (temp != 0) { ++digits; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) { --digits; buffer[digits] = bytes1(uint8(48 + value % 10)); value /= 10; }
        return string(buffer);
    }
}
