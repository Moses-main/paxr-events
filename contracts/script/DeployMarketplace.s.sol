// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {PaxrMarketplace} from "../src/PaxrMarketplace.sol";

contract DeployMarketplace is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        address deployer = vm.addr(deployerPrivateKey);

        // Already deployed event contract address
        address eventAddress = 0x9397eBE8d5235fb818736eA8b2c90c3a51c5d278;

        vm.startBroadcast(deployerPrivateKey);

        PaxrMarketplace marketplace = new PaxrMarketplace(
            deployer,
            treasury,
            eventAddress
        );
        console.log("PaxrMarketplace deployed at:", address(marketplace));

        vm.stopBroadcast();
    }
}
