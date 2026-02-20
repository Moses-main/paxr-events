// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {PaxrEvent} from "../src/PaxrEvent.sol";

contract CreateTestEvent is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        // Already deployed event contract
        address eventAddress = 0x9397eBE8d5235fb818736eA8b2c90c3a51c5d278;
        
        vm.startBroadcast(deployerPrivateKey);
        
        PaxrEvent eventContract = PaxrEvent(eventAddress);
        
        // Use block.timestamp directly - sale start time must be <= current time (in the past)
        uint256 currentTime = block.timestamp;
        
        console.log("Current block timestamp:", currentTime);
        
        // Set saleStartTime to 60 seconds in the past to definitely be in the past
        uint256 saleStartTime = currentTime - 60;
        
        uint256 eventId = eventContract.createEvent(
            "Web3 Hackathon Lagos",           // name
            "Join us for the biggest Web3 hackathon in Nigeria. Build the future of decentralized apps!", // description
            "",                                // imageURI (empty for now)
            "Lagos, Nigeria",                  // location
            10000000000000000,                // ticketPrice (0.01 ETH in wei)
            100,                               // totalTickets
            currentTime + 7 days,              // eventDate (7 days from now)
            saleStartTime,                     // saleStartTime (60 seconds in the PAST)
            currentTime + 30 days,             // saleEndTime (30 days from now)
            address(0),                        // paymentToken (ETH)
            true,                              // resaleEnabled
            20000000000000000,                // maxResalePrice (0.02 ETH in wei)
            0                                   // groupBuyDiscount (0%)
        );
        
        console.log("Event created with ID:", eventId);
        
        vm.stopBroadcast();
    }
}
