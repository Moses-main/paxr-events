// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {PaxrEvent} from "../src/PaxrEvent.sol";
import {PaxrTicket} from "../src/PaxrTicket.sol";
import {PaxrMarketplace} from "../src/PaxrMarketplace.sol";

contract DeployPaxr is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        PaxrEvent eventContract = new PaxrEvent(deployer, treasury);
        console.log("PaxrEvent deployed at:", address(eventContract));

        PaxrTicket ticketNFT = eventContract.ticketNFT();
        console.log("PaxrTicket deployed at:", address(ticketNFT));

        // Initialize the ticket NFT with the event contract address
        // Note: setEventContract is only callable by the ticket owner (deployer)
        ticketNFT.setEventContract(address(eventContract));
        console.log("Event contract initialized in ticket NFT");

        PaxrMarketplace marketplace = new PaxrMarketplace(
            deployer,
            treasury,
            address(eventContract)
        );
        console.log("PaxrMarketplace deployed at:", address(marketplace));

        vm.stopBroadcast();
    }
}
