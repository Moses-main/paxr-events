// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {PaxrTicket} from "./PaxrTicket.sol";
import {PaxrEvent} from "./PaxrEvent.sol";

contract PaxrMarketplace is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    PaxrTicket public ticketNFT;
    PaxrEvent public eventContract;

    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 price;
        uint256 eventId;
        uint256 listingTime;
        bool active;
    }

    struct Offer {
        address offerer;
        uint256 price;
        bool accepted;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Offer[]) public offers;
    mapping(address => bool) public isBot;

    uint256 public platformFeePercent = 700; // 7%
    uint256 public botPenaltyPercent = 1000;
    address public treasury;
    uint256 public constant LISTING_DURATION = 7 days;
    uint256 public constant MIN_PRICE = 0.0001 ether;

    event TicketListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed tokenId);
    event TicketSold(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event OfferMade(uint256 indexed tokenId, address indexed offerer, uint256 price);
    event OfferAccepted(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event BotDetected(address indexed bot);

    modifier onlyTicketOwner(uint256 tokenId) {
        require(ticketNFT.ownerOf(tokenId) == msg.sender, "Not ticket owner");
        _;
    }

    constructor(address initialOwner, address _treasury, address _eventContract) Ownable(initialOwner) {
        treasury = _treasury;
        eventContract = PaxrEvent(_eventContract);
        ticketNFT = PaxrEvent(_eventContract).ticketNFT();
    }

    function listTicket(uint256 tokenId, uint256 price) external onlyTicketOwner(tokenId) nonReentrant {
        require(price >= MIN_PRICE, "Price too low");
        
        PaxrTicket.TicketData memory ticketData = ticketNFT.getTicketData(tokenId);
        uint256 eventId = ticketData.eventId;
        
        (uint256 ticketPrice, bool resaleEnabled, uint256 maxResalePrice) = 
            eventContract.getEventPriceAndResale(eventId);
        
        require(eventContract.eventExists(eventId), "Event does not exist");
        require(resaleEnabled, "Resale not enabled");
        
        uint256 maxAllowed = ticketPrice * 2;
        if (maxAllowed < maxResalePrice) {
            maxAllowed = maxResalePrice;
        }
        if (maxAllowed > 0) {
            require(price <= maxAllowed, "Price exceeds maximum");
        }

        ticketNFT.transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing({
            seller: msg.sender,
            tokenId: tokenId,
            price: price,
            eventId: eventId,
            listingTime: block.timestamp,
            active: true
        });

        emit TicketListed(tokenId, msg.sender, price);
    }

    function buyTicket(uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Not listed");
        require(block.timestamp <= listing.listingTime + LISTING_DURATION, "Listing expired");
        require(msg.value >= listing.price, "Insufficient payment");

        uint256 fee = (listing.price * platformFeePercent) / 10000;
        uint256 sellerAmount = listing.price - fee;

        (bool success, ) = payable(treasury).call{value: fee}("");
        require(success, "Fee transfer failed");

        (success, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(success, "Seller payment failed");

        ticketNFT.transferFrom(address(this), msg.sender, tokenId);

        listing.active = false;

        emit TicketSold(tokenId, msg.sender, listing.price);
    }

    function cancelListing(uint256 tokenId) external onlyTicketOwner(tokenId) nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Not listed");

        ticketNFT.transferFrom(address(this), msg.sender, tokenId);
        listing.active = false;

        emit ListingCancelled(tokenId);
    }

    function makeOffer(uint256 tokenId, uint256 price) external payable {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Not listed");
        require(msg.value >= price, "Insufficient offer");

        offers[tokenId].push(Offer({
            offerer: msg.sender,
            price: price,
            accepted: false
        }));

        emit OfferMade(tokenId, msg.sender, price);
    }

    function acceptOffer(uint256 tokenId, uint256 offerIndex) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Not listed");
        
        Offer storage offer = offers[tokenId][offerIndex];
        require(!offer.accepted, "Already accepted");
        require(msg.sender == listing.seller, "Not seller");

        uint256 fee = (offer.price * platformFeePercent) / 10000;
        uint256 sellerAmount = offer.price - fee;

        (bool success, ) = payable(treasury).call{value: fee}("");
        require(success, "Fee transfer failed");

        (success, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(success, "Seller payment failed");

        ticketNFT.transferFrom(address(this), offer.offerer, tokenId);

        listing.active = false;
        offer.accepted = true;

        emit OfferAccepted(tokenId, offer.offerer, offer.price);
    }

    function detectBot(address account) external onlyOwner {
        isBot[account] = true;
        emit BotDetected(account);
    }

    function removeBot(address account) external onlyOwner {
        isBot[account] = false;
    }

    function isBotAccount(address account) external view returns (bool) {
        return isBot[account];
    }

    function getListings() external view returns (Listing[] memory) {
        uint256 ticketCount = ticketNFT.currentEventId();
        Listing[] memory activeListings = new Listing[](ticketCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= ticketCount; i++) {
            if (listings[i].active) {
                activeListings[index] = listings[i];
                index++;
            }
        }

        Listing[] memory result = new Listing[](index);
        for (uint256 i = 0; i < index; i++) {
            result[i] = activeListings[i];
        }
        return result;
    }

    function getOffers(uint256 tokenId) external view returns (Offer[] memory) {
        return offers[tokenId];
    }

    function setPlatformFee(uint256 _platformFeePercent) external onlyOwner {
        require(_platformFeePercent <= 1000, "Fee too high");
        platformFeePercent = _platformFeePercent;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    receive() external payable {}
}
