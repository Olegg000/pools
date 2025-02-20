// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ERC20.sol";
import "./Pool.sol";

contract Factory {

    address[] public pools;

    uint256 LPTokenPrice;
    address LPTokenAddr;

    constructor(uint256 _LPTokenPrice, address _LPTokenAddr){
        LPTokenPrice = _LPTokenPrice;
        LPTokenAddr = _LPTokenAddr;
    }

    function createPool(address token1, address token2, string memory poolName) public {
        Pool a = new Pool(LPTokenPrice,LPTokenAddr,msg.sender,address(this),token1, token2, poolName);
        pools.push(address(a));
        ERC20 lptok = ERC20(LPTokenAddr);
        lptok.canMintAdd(address(a));
    }

    function getAllPool() public view returns(address[] memory _pools) {
        return pools;
    }

}
