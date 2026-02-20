// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

library Counters {
    struct Counter {
        uint256 _value;
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

contract PaxrTicket is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct TicketData {
        uint256 eventId;
        uint256 purchasePrice;
        uint256 purchaseTime;
        address originalBuyer;
        bool isUsed;
    }

    mapping(uint256 => TicketData) public ticketData;
    mapping(uint256 => string) private _tokenURIs;

    uint256 public currentEventId;
    address public eventContract;

    event TicketMinted(address indexed to, uint256 indexed tokenId, uint256 eventId);
    event TicketUsed(address indexed user, uint256 indexed tokenId);
    event TicketTransferred(address indexed from, address indexed to, uint256 indexed tokenId);

    modifier onlyEventContract() {
        require(msg.sender == eventContract, "Only event contract");
        _;
    }

    constructor(address initialOwner) ERC721("Paxr Ticket", "PAXRT") Ownable(initialOwner) {
        _tokenIdCounter.increment();
    }

    function setEventContract(address _eventContract) external onlyOwner {
        require(_eventContract != address(0), "Invalid address");
        eventContract = _eventContract;
    }

    function mintTicket(
        address to,
        uint256 eventId,
        uint256 price,
        string memory uri
    ) external onlyEventContract returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        ticketData[tokenId] = TicketData({
            eventId: eventId,
            purchasePrice: price,
            purchaseTime: block.timestamp,
            originalBuyer: to,
            isUsed: false
        });

        emit TicketMinted(to, tokenId, eventId);
        return tokenId;
    }

    function useTicket(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not ticket owner");
        require(!ticketData[tokenId].isUsed, "Ticket already used");

        ticketData[tokenId].isUsed = true;
        emit TicketUsed(msg.sender, tokenId);
    }

    function getTicketData(uint256 tokenId) external view returns (TicketData memory) {
        require(_ownerOf(tokenId) != address(0), "Ticket does not exist");
        return ticketData[tokenId];
    }

    function isTicketValid(uint256 tokenId) external view returns (bool) {
        return _ownerOf(tokenId) != address(0) && !ticketData[tokenId].isUsed;
    }

    function getTicketsByOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokens;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal override {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        string memory storedURI = _tokenURIs[tokenId];
        if (bytes(storedURI).length > 0) {
            return storedURI;
        }
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address result = super._update(to, tokenId, auth);
        if (auth != address(0) && to != address(0)) {
            emit TicketTransferred(_ownerOf(tokenId), to, tokenId);
        }
        return result;
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
}
