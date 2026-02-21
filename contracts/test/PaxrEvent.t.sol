// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {PaxrEvent} from "../src/PaxrEvent.sol";
import {PaxrTicket} from "../src/PaxrTicket.sol";

contract PaxrEventTest is Test {
    PaxrEvent public paxrEvent;
    PaxrTicket public paxrTicket;
    
    address public organizer = makeAddr("organizer");
    address public buyer1 = makeAddr("buyer1");
    address public treasury = makeAddr("treasury");
    
    uint256 public eventId;
    
    function setUp() public {
        vm.deal(organizer, 100 ether);
        vm.deal(buyer1, 100 ether);
        
        paxrEvent = new PaxrEvent(organizer, treasury);
        paxrTicket = paxrEvent.ticketNFT();
        
        vm.prank(organizer);
        eventId = paxrEvent.createEvent(
            "Test Event",
            "This is a test event",
            "https://example.com/image.png",
            "Test Location",
            0.01 ether,
            25,
            100,
            block.timestamp + 7 days,
            block.timestamp,
            block.timestamp + 30 days,
            address(0),
            true,
            0.02 ether,
            0.001 ether
        );
        vm.stopPrank();
    }
    
    function test_CreateEvent() public {
        assertEq(paxrEvent.eventCount(), 1);
        assertEq(paxrEvent.getEventOrganizer(eventId), organizer);
        assertTrue(paxrEvent.eventExists(eventId));
    }
    
    function test_CreateEventFailZeroTickets() public {
        vm.prank(organizer);
        vm.expectRevert("Must have tickets");
        paxrEvent.createEvent(
            "Test Event",
            "Description",
            "https://example.com/image.png",
            "Location",
            0.01 ether,
            25,
            0,
            block.timestamp + 7 days,
            block.timestamp,
            block.timestamp + 30 days,
            address(0),
            true,
            0.02 ether,
            0.001 ether
        );
        vm.stopPrank();
    }
    
    function test_CreateEventFailInvalidSaleWindow() public {
        vm.prank(organizer);
        vm.expectRevert("Invalid sale window");
        paxrEvent.createEvent(
            "Test Event",
            "Description",
            "https://example.com/image.png",
            "Location",
            0.01 ether,
            25,
            100,
            block.timestamp + 7 days,
            block.timestamp + 30 days,
            block.timestamp + 1 days,
            address(0),
            true,
            0.02 ether,
            0.001 ether
        );
        vm.stopPrank();
    }
    
    function test_RSVP() public {
        vm.prank(buyer1);
        paxrEvent.rsvp(eventId);
        vm.stopPrank();
        
        assertTrue(paxrEvent.hasRSVPd(eventId, buyer1));
    }
    
    function test_RSVPDuplicate() public {
        vm.prank(buyer1);
        paxrEvent.rsvp(eventId);
        vm.stopPrank();
        
        vm.prank(buyer1);
        vm.expectRevert("Already RSVPd");
        paxrEvent.rsvp(eventId);
        vm.stopPrank();
    }
    
    function test_RSVPEventDoesNotExist() public {
        vm.prank(buyer1);
        vm.expectRevert("Event does not exist");
        paxrEvent.rsvp(999);
        vm.stopPrank();
    }
    
    function test_UpdateEvent() public {
        vm.prank(organizer);
        paxrEvent.updateEvent(
            eventId,
            "Updated Event",
            "Updated Description",
            "https://example.com/new-image.png",
            "New Location",
            false,
            false,
            0.05 ether
        );
        vm.stopPrank();
        
        assertEq(paxrEvent.getEventOrganizer(eventId), organizer);
    }
    
    function test_UpdateEventNotOrganizer() public {
        vm.prank(buyer1);
        vm.expectRevert("Not organizer");
        paxrEvent.updateEvent(
            eventId,
            "Hacked Event",
            "Description",
            "https://example.com/image.png",
            "Location",
            false,
            false,
            0
        );
        vm.stopPrank();
    }
    
    function test_SetPlatformFee() public {
        vm.prank(organizer);
        paxrEvent.setPlatformFee(500);
        vm.stopPrank();
        
        assertEq(paxrEvent.platformFeePercent(), 500);
    }
    
    function test_SetPlatformFeeTooHigh() public {
        vm.prank(organizer);
        vm.expectRevert("Fee too high");
        paxrEvent.setPlatformFee(1001);
        vm.stopPrank();
    }
    
    function test_SetTreasury() public {
        address newTreasury = makeAddr("newTreasury");
        
        vm.prank(organizer);
        paxrEvent.setTreasury(newTreasury);
        vm.stopPrank();
        
        assertEq(paxrEvent.treasury(), newTreasury);
    }
    
    function test_GetEventOrganizer() public {
        assertEq(paxrEvent.getEventOrganizer(eventId), organizer);
    }
    
    function test_GetEventPriceAndResale() public {
        (uint256 price, bool resale, uint256 maxResale) = paxrEvent.getEventPriceAndResale(eventId);
        
        assertEq(price, 0.01 ether);
        assertTrue(resale);
        assertEq(maxResale, 0.02 ether);
    }
}
