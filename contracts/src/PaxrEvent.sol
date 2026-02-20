// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {PaxrTicket} from "./PaxrTicket.sol";

contract PaxrEvent is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    PaxrTicket public ticketNFT;

    struct Event {
        string name;
        string description;
        string imageURI;
        string location;
        uint256 ticketPrice;
        uint256 totalTickets;
        uint256 ticketsSold;
        uint256 eventDate;
        uint256 saleStartTime;
        uint256 saleEndTime;
        address organizer;
        address paymentToken;
        bool isActive;
        bool resaleEnabled;
        uint256 maxResalePrice;
        uint256 platformFeePercent;
        uint256 groupBuyDiscount;
    }

    struct GroupBuy {
        uint256 eventId;
        address creator;
        uint256 ticketPrice;
        uint256 discountedPrice;
        uint256 minParticipants;
        uint256 currentParticipants;
        uint256 maxParticipants;
        uint256 endTime;
        bool fulfilled;
        bool cancelled;
        uint256 ticketId;
    }

    struct GroupBuyParticipant {
        address participant;
        uint256 contribution;
        bool hasReceivedTicket;
    }

    mapping(uint256 => GroupBuy) public groupBuys;
    mapping(uint256 => mapping(address => GroupBuyParticipant)) public groupBuyParticipants;
    mapping(uint256 => address[]) public groupBuyParticipantList;
    mapping(uint256 => uint256) public groupBuyCount;

    mapping(uint256 => Event) public events;
    mapping(uint256 => bool) public eventExists;
    mapping(uint256 => mapping(address => bool)) public hasPurchased;
    mapping(uint256 => mapping(address => uint256)) public purchasedCount;
    mapping(uint256 => uint256[]) public eventTickets;
    mapping(uint256 => mapping(address => bool)) public hasRSVPd;

    uint256 public eventCount;
    uint256 public platformFeePercent = 700; // 7%
    address public treasury;

    event EventCreated(uint256 indexed eventId, address indexed organizer);
    event TicketPurchased(uint256 indexed eventId, address indexed buyer, uint256 amount);
    event RSVPReceived(uint256 indexed eventId, address indexed attendee);
    event GroupBuyCreated(uint256 indexed eventId, uint256 groupBuyId);
    event GroupBuyFulfilled(uint256 indexed eventId, uint256 groupBuyId);
    event FundsWithdrawn(uint256 indexed eventId, uint256 amount);
    event EventUpdated(uint256 indexed eventId);

    constructor(address initialOwner, address _treasury) Ownable(initialOwner) {
        treasury = _treasury;
        ticketNFT = new PaxrTicket(initialOwner);
    }

    function createEvent(
        string memory name,
        string memory description,
        string memory imageURI,
        string memory location,
        uint256 ticketPrice,
        uint256 totalTickets,
        uint256 eventDate,
        uint256 saleStartTime,
        uint256 saleEndTime,
        address paymentToken,
        bool resaleEnabled,
        uint256 maxResalePrice,
        uint256 groupBuyDiscount
    ) external returns (uint256) {
        require(totalTickets > 0, "Must have tickets");
        require(saleEndTime > saleStartTime, "Invalid sale window");
        require(saleStartTime >= block.timestamp, "Sale must start in future");

        // Prevent group buy discount from exceeding ticket price
        if (groupBuyDiscount > 0) {
            require(groupBuyDiscount < ticketPrice, "Discount too high");
        }

        eventCount++;
        uint256 eventId = eventCount;

        events[eventId] = Event({
            name: name,
            description: description,
            imageURI: imageURI,
            location: location,
            ticketPrice: ticketPrice,
            totalTickets: totalTickets,
            ticketsSold: 0,
            eventDate: eventDate,
            saleStartTime: saleStartTime,
            saleEndTime: saleEndTime,
            organizer: msg.sender,
            paymentToken: paymentToken,
            isActive: true,
            resaleEnabled: resaleEnabled,
            maxResalePrice: maxResalePrice,
            platformFeePercent: platformFeePercent,
            groupBuyDiscount: groupBuyDiscount
        });

        eventExists[eventId] = true;
        emit EventCreated(eventId, msg.sender);

        return eventId;
    }

    function purchaseTicket(uint256 eventId, uint256 quantity) external payable nonReentrant {
        Event storage evt = events[eventId];
        require(eventExists[eventId], "Event does not exist");
        require(evt.isActive, "Event not active");
        require(block.timestamp >= evt.saleStartTime, "Sale not started");
        require(block.timestamp <= evt.saleEndTime, "Sale ended");
        require(evt.ticketsSold + quantity <= evt.totalTickets, "Not enough tickets");
        require(quantity > 0 && quantity <= 100, "Invalid quantity");

        uint256 totalPrice = evt.ticketPrice * quantity;
        
        // Calculate platform fee
        uint256 platformFee = (totalPrice * evt.platformFeePercent) / 10000;
        uint256 organizerAmount = totalPrice - platformFee;

        if (evt.paymentToken == address(0)) {
            require(msg.value >= totalPrice, "Insufficient ETH");
            // Transfer platform fee to treasury
            (bool success, ) = payable(treasury).call{value: platformFee}("");
            require(success, "Fee transfer failed");
            // Transfer organizer amount
            (success, ) = payable(evt.organizer).call{value: organizerAmount}("");
            require(success, "Transfer failed");
            // Refund excess ETH
            if (msg.value > totalPrice) {
                (success, ) = payable(msg.sender).call{value: msg.value - totalPrice}("");
            }
        } else {
            IERC20(evt.paymentToken).safeTransferFrom(msg.sender, treasury, platformFee);
            IERC20(evt.paymentToken).safeTransferFrom(msg.sender, evt.organizer, organizerAmount);
        }

        evt.ticketsSold += quantity;
        purchasedCount[eventId][msg.sender] += quantity;
        hasPurchased[eventId][msg.sender] = true;

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = ticketNFT.mintTicket(
                msg.sender,
                eventId,
                evt.ticketPrice,
                evt.imageURI
            );
            eventTickets[eventId].push(tokenId);
        }

        emit TicketPurchased(eventId, msg.sender, quantity);
    }

    function rsvp(uint256 eventId) external {
        Event storage evt = events[eventId];
        require(eventExists[eventId], "Event does not exist");
        require(!hasRSVPd[eventId][msg.sender], "Already RSVPd");

        hasRSVPd[eventId][msg.sender] = true;
        emit RSVPReceived(eventId, msg.sender);
    }

    function createGroupBuy(
        uint256 eventId,
        uint256 minParticipants,
        uint256 maxParticipants,
        uint256 duration
    ) external {
        Event storage evt = events[eventId];
        require(eventExists[eventId], "Event does not exist");
        require(evt.groupBuyDiscount > 0 && evt.groupBuyDiscount < evt.ticketPrice, "Group buy not enabled or discount invalid");
        require(minParticipants > 0 && maxParticipants >= minParticipants, "Invalid participants");
        require(duration > 0 && duration <= 30 days, "Invalid duration");
        
        uint256 groupBuyId = groupBuyCount[eventId];
        
        uint256 discountedPrice = evt.ticketPrice - evt.groupBuyDiscount;
        
        groupBuys[eventId * 1000 + groupBuyId] = GroupBuy({
            eventId: eventId,
            creator: msg.sender,
            ticketPrice: evt.ticketPrice,
            discountedPrice: discountedPrice,
            minParticipants: minParticipants,
            currentParticipants: 0,
            maxParticipants: maxParticipants,
            endTime: block.timestamp + duration,
            fulfilled: false,
            cancelled: false,
            ticketId: 0
        });
        
        groupBuyCount[eventId]++;
        
        emit GroupBuyCreated(eventId, groupBuyId);
    }

    function joinGroupBuy(uint256 eventId, uint256 groupBuyId) external payable {
        uint256 key = eventId * 1000 + groupBuyId;
        GroupBuy storage groupBuy = groupBuys[key];
        
        require(groupBuy.eventId == eventId, "Group buy does not exist");
        require(!groupBuy.fulfilled, "Group buy fulfilled");
        require(!groupBuy.cancelled, "Group buy cancelled");
        require(block.timestamp <= groupBuy.endTime, "Group buy expired");
        require(groupBuy.currentParticipants < groupBuy.maxParticipants, "Group buy full");
        
        GroupBuyParticipant storage participant = groupBuyParticipants[key][msg.sender];
        require(participant.contribution == 0, "Already joined");
        
        require(msg.value >= groupBuy.discountedPrice, "Insufficient ETH");
        
        participant.participant = msg.sender;
        participant.contribution = msg.value;
        participant.hasReceivedTicket = false;
        
        groupBuyParticipantList[key].push(msg.sender);
        groupBuy.currentParticipants++;
        
        if (groupBuy.currentParticipants >= groupBuy.minParticipants) {
            _fulfillGroupBuy(eventId, groupBuyId, key);
        }
    }

    function _fulfillGroupBuy(uint256 eventId, uint256 groupBuyId, uint256 key) internal {
        GroupBuy storage groupBuy = groupBuys[key];
        Event storage evt = events[eventId];
        
        groupBuy.fulfilled = true;
        
        address[] memory participants = groupBuyParticipantList[key];
        
        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            GroupBuyParticipant storage p = groupBuyParticipants[key][participant];
            
            if (!p.hasReceivedTicket) {
                uint256 tokenId = ticketNFT.mintTicket(
                    participant,
                    eventId,
                    groupBuy.discountedPrice,
                    evt.imageURI
                );
                p.hasReceivedTicket = true;
                
                if (i == 0) {
                    groupBuy.ticketId = tokenId;
                }
            }
            
            uint256 refund = p.contribution - groupBuy.discountedPrice;
            if (refund > 0) {
                (bool success, ) = payable(participant).call{value: refund}("");
                require(success, "Refund failed");
            }
        }
        
        uint256 organizerPayment = groupBuy.discountedPrice * participants.length;
        (bool success, ) = payable(evt.organizer).call{value: organizerPayment}("");
        require(success, "Organizer payment failed");
        
        evt.ticketsSold += participants.length;
        
        emit GroupBuyFulfilled(eventId, groupBuyId);
    }

    function claimRefund(uint256 eventId, uint256 groupBuyId) external {
        uint256 key = eventId * 1000 + groupBuyId;
        GroupBuy storage groupBuy = groupBuys[key];
        
        require(groupBuy.endTime < block.timestamp, "Group buy not expired");
        require(!groupBuy.fulfilled, "Group buy fulfilled");
        require(!groupBuy.cancelled, "Already cancelled");
        
        GroupBuyParticipant storage participant = groupBuyParticipants[key][msg.sender];
        require(participant.contribution > 0, "Not a participant");
        
        uint256 refund = participant.contribution;
        participant.contribution = 0;
        
        (bool success, ) = payable(msg.sender).call{value: refund}("");
        require(success, "Refund failed");
        
        groupBuy.cancelled = true;
    }

    function getGroupBuy(uint256 eventId, uint256 groupBuyId) external view returns (GroupBuy memory) {
        return groupBuys[eventId * 1000 + groupBuyId];
    }

    function getGroupBuyParticipant(uint256 eventId, uint256 groupBuyId, address participant) external view returns (GroupBuyParticipant memory) {
        return groupBuyParticipants[eventId * 1000 + groupBuyId][participant];
    }

    function getGroupBuyCount(uint256 eventId) external view returns (uint256) {
        return groupBuyCount[eventId];
    }

    function updateEvent(
        uint256 eventId,
        string memory name,
        string memory description,
        string memory imageURI,
        string memory location,
        bool isActive,
        bool resaleEnabled,
        uint256 maxResalePrice
    ) external {
        require(eventExists[eventId], "Event does not exist");
        Event storage evt = events[eventId];
        require(msg.sender == evt.organizer, "Not organizer");

        evt.name = name;
        evt.description = description;
        evt.imageURI = imageURI;
        evt.location = location;
        evt.isActive = isActive;
        evt.resaleEnabled = resaleEnabled;
        evt.maxResalePrice = maxResalePrice;

        emit EventUpdated(eventId);
    }

    function getEventDetails(uint256 eventId) external view returns (Event memory) {
        return events[eventId];
    }

    function getEventPriceAndResale(uint256 eventId) external view returns (
        uint256 ticketPrice,
        bool resaleEnabled,
        uint256 maxResalePrice
    ) {
        Event storage evt = events[eventId];
        return (evt.ticketPrice, evt.resaleEnabled, evt.maxResalePrice);
    }

    function getEventOrganizer(uint256 eventId) external view returns (address) {
        return events[eventId].organizer;
    }

    function getEventTickets(uint256 eventId) external view returns (uint256[] memory) {
        return eventTickets[eventId];
    }

    function hasPurchasedTickets(address user, uint256 eventId) external view returns (bool) {
        return hasPurchased[eventId][user];
    }

    function setPlatformFee(uint256 _platformFeePercent) external onlyOwner {
        require(_platformFeePercent <= 1000, "Fee too high");
        platformFeePercent = _platformFeePercent;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }
}
