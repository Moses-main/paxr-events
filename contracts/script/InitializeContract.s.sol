// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {PaxrEvent} from "../src/PaxrEvent.sol";
import {PaxrTicket} from "../src/PaxrTicket.sol";

contract InitializeContract is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        address eventAddress = 0x788eB781ceFA6fAB73F25F0EB22a5D59435f5394;
        
        vm.startBroadcast(deployerPrivateKey);
        
        PaxrEvent eventContract = PaxrEvent(eventAddress);
        
        PaxrTicket ticketNFT = eventContract.ticketNFT();
        address ticketEventContract = ticketNFT.eventContract();
        
        console.log("Ticket NFT address:", address(ticketNFT));
        console.log("Current eventContract in ticket:", ticketEventContract);
        console.log("Expected eventContract:", eventAddress);
        
        if (ticketEventContract == address(0)) {
            console.log("Ticket NFT not initialized! Calling initialize()...");
            eventContract.initialize();
            console.log("Contract initialized successfully!");
        } else if (ticketEventContract == eventAddress) {
            console.log("Contract already initialized!");
        } else {
            console.log("WARNING: Ticket NFT has different eventContract set!");
        }
        
        uint256 eventCount = eventContract.eventCount();
        console.log("Total events:", eventCount);
        
        vm.stopBroadcast();
    }
}
