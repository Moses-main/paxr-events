// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {PaxrTicket} from "../src/PaxrTicket.sol";

contract PaxrTicketTest is Test {
    PaxrTicket public paxrTicket;
    
    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    address public eventContract = makeAddr("eventContract");
    
    uint256 public tokenId;
    
    function setUp() public {
        vm.prank(owner);
        paxrTicket = new PaxrTicket(owner);
        
        vm.prank(owner);
        paxrTicket.setEventContract(eventContract);
    }
    
    function test_Constructor() public {
        assertEq(paxrTicket.name(), "Paxr Ticket");
        assertEq(paxrTicket.symbol(), "PAXRT");
    }
    
    function test_SetEventContract() public {
        address newEventContract = makeAddr("newEventContract");
        
        vm.prank(owner);
        paxrTicket.setEventContract(newEventContract);
        
        assertEq(paxrTicket.eventContract(), newEventContract);
    }
    
    function test_SetEventContractInvalidAddress() public {
        vm.prank(owner);
        vm.expectRevert("Invalid address");
        paxrTicket.setEventContract(address(0));
    }
    
    function test_SetEventContractNotOwner() public {
        vm.expectRevert();
        vm.prank(user1);
        paxrTicket.setEventContract(eventContract);
    }
    
    function test_MintTicket() public {
        vm.prank(eventContract);
        tokenId = paxrTicket.mintTicket(
            user1,
            1,
            0.01 ether,
            "https://example.com/ticket.png"
        );
        
        assertEq(tokenId, 1);
        assertEq(paxrTicket.ownerOf(tokenId), user1);
    }
    
    function test_MintTicketOnlyEventContract() public {
        vm.expectRevert("Only event contract");
        vm.prank(user1);
        paxrTicket.mintTicket(user1, 1, 0.01 ether, "https://example.com/ticket.png");
    }
    
    function test_UseTicket() public {
        vm.prank(eventContract);
        tokenId = paxrTicket.mintTicket(user1, 1, 0.01 ether, "https://example.com/ticket.png");
        
        vm.prank(user1);
        paxrTicket.useTicket(tokenId);
        
        assertFalse(paxrTicket.isTicketValid(tokenId));
    }
    
    function test_UseTicketNotOwner() public {
        vm.prank(eventContract);
        tokenId = paxrTicket.mintTicket(user1, 1, 0.01 ether, "https://example.com/ticket.png");
        
        vm.expectRevert("Not ticket owner");
        vm.prank(user2);
        paxrTicket.useTicket(tokenId);
    }
    
    function test_UseTicketAlreadyUsed() public {
        vm.prank(eventContract);
        tokenId = paxrTicket.mintTicket(user1, 1, 0.01 ether, "https://example.com/ticket.png");
        
        vm.prank(user1);
        paxrTicket.useTicket(tokenId);
        
        vm.expectRevert("Ticket already used");
        vm.prank(user1);
        paxrTicket.useTicket(tokenId);
    }
    
    function test_GetTicketData() public {
        vm.prank(eventContract);
        tokenId = paxrTicket.mintTicket(user1, 1, 0.01 ether, "https://example.com/ticket.png");
        
        PaxrTicket.TicketData memory data = paxrTicket.getTicketData(tokenId);
        
        assertEq(data.eventId, 1);
        assertEq(data.purchasePrice, 0.01 ether);
        assertEq(data.originalBuyer, user1);
        assertFalse(data.isUsed);
    }
    
    function test_GetTicketDataNonExistent() public {
        vm.expectRevert("Ticket does not exist");
        paxrTicket.getTicketData(999);
    }
    
    function test_IsTicketValid() public {
        vm.prank(eventContract);
        tokenId = paxrTicket.mintTicket(user1, 1, 0.01 ether, "https://example.com/ticket.png");
        
        assertTrue(paxrTicket.isTicketValid(tokenId));
        
        vm.prank(user1);
        paxrTicket.useTicket(tokenId);
        
        assertFalse(paxrTicket.isTicketValid(tokenId));
    }
    
    function test_IsTicketValidNonExistent() public {
        assertFalse(paxrTicket.isTicketValid(999));
    }
    
    function test_GetTicketsByOwner() public {
        vm.startPrank(eventContract);
        
        uint256 token1 = paxrTicket.mintTicket(user1, 1, 0.01 ether, "https://example.com/ticket1.png");
        uint256 token2 = paxrTicket.mintTicket(user1, 2, 0.02 ether, "https://example.com/ticket2.png");
        uint256 token3 = paxrTicket.mintTicket(user1, 3, 0.03 ether, "https://example.com/ticket3.png");
        
        vm.stopPrank();
        
        uint256[] memory tokens = paxrTicket.getTicketsByOwner(user1);
        
        assertEq(tokens.length, 3);
        assertEq(tokens[0], token1);
        assertEq(tokens[1], token2);
        assertEq(tokens[2], token3);
    }
    
    function test_GetTicketsByOwnerEmpty() public {
        uint256[] memory tokens = paxrTicket.getTicketsByOwner(user1);
        
        assertEq(tokens.length, 0);
    }
    
    function test_TokenURI() public {
        vm.prank(eventContract);
        tokenId = paxrTicket.mintTicket(user1, 1, 0.01 ether, "https://example.com/ticket.png");
        
        string memory uri = paxrTicket.tokenURI(tokenId);
        
        assertEq(uri, "https://example.com/ticket.png");
    }
    
    function test_SafeTransferFrom() public {
        vm.prank(eventContract);
        tokenId = paxrTicket.mintTicket(user1, 1, 0.01 ether, "https://example.com/ticket.png");
        
        vm.prank(user1);
        paxrTicket.safeTransferFrom(user1, user2, tokenId);
        
        assertEq(paxrTicket.ownerOf(tokenId), user2);
    }
    
    function test_BalanceOf() public {
        vm.startPrank(eventContract);
        
        paxrTicket.mintTicket(user1, 1, 0.01 ether, "https://example.com/ticket1.png");
        paxrTicket.mintTicket(user1, 2, 0.02 ether, "https://example.com/ticket2.png");
        paxrTicket.mintTicket(user2, 3, 0.03 ether, "https://example.com/ticket3.png");
        
        vm.stopPrank();
        
        assertEq(paxrTicket.balanceOf(user1), 2);
        assertEq(paxrTicket.balanceOf(user2), 1);
    }
}
