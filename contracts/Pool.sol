// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./Factory.sol";
import "./ERC20.sol";

contract Pool {

    address public token1;
    address public token2;

    uint public reversesToken1;
    uint public reversesToken2;

    address public owner;
    Factory public factory;
    string public poolName;

    address public LPTokenAddr;
    uint256 public LPTokenPrice;

    constructor (uint256 _LPTokenPrice, address _LPTokenAddr, address _owner,address _factoryAddr, address _token1, address _token2, string memory _poolName){
        require(_LPTokenAddr != address(0) && _token1 != address(0) && _token2 != address(0),"Invalid address");
        poolName = _poolName;
        token1 = _token1;
        token2 = _token2;
        factory = Factory(_factoryAddr);
        LPTokenAddr = _LPTokenAddr;
        LPTokenPrice = _LPTokenPrice;
        owner = _owner;
    }

    function liquidityTokenAdd(uint amount, uint tokenNum) amountCheck(amount) public {
        if (tokenNum  == 1){
            ERC20(token1).transferFrom(msg.sender, address(this), amount);
            reversesToken1 += amount;
        } else if (tokenNum == 2){
            ERC20(token2).transferFrom(msg.sender, address(this), amount);
            reversesToken2 += amount;
        } else {
            revert("This num dosnt exist");
        }

        uint lpTokensToMint = (amount)/LPTokenPrice;
        ERC20 lptok = ERC20(LPTokenAddr);
        lptok.mint(msg.sender,lpTokensToMint);
    }

    function swapToken(uint tokenNumInput, uint amountIn) amountCheck(amountIn) public {
        uint256 token1Supply = ERC20(token1).totalSupply();
        uint256 token2Supply = ERC20(token2).totalSupply();

// получаем цены, что рассчитываются в зависимости от количества токенов на рынке
        if (tokenNumInput == 1) {
            uint amountOut = (amountIn * token1Supply * reversesToken2)/(token2Supply * reversesToken1);
            require(reversesToken2 >= amountOut , "Not enough tokens in the pool");

            ERC20(token1).transferFrom(msg.sender, address(this),amountIn);
            ERC20(token2).transfer(msg.sender, amountOut);

            reversesToken1 += amountIn;
            reversesToken2 -= amountOut;
        } else if (tokenNumInput == 2) {
            uint amountOut = (amountIn * token2Supply * reversesToken1)/(token1Supply * reversesToken2);
            require(reversesToken1 >= amountOut , "Not enough tokens in the pool");

            ERC20(token2).transferFrom(msg.sender, address(this),amountIn);
            ERC20(token1).transfer(msg.sender, amountOut);

            reversesToken2 += amountIn;
            reversesToken1 -= amountOut;
        } else {
            revert("Invalid Num");
        }

        uint lpTokensToMint = (amountIn)/LPTokenPrice;
        ERC20 lptok = ERC20(LPTokenAddr);
        lptok.mint(address(this),lpTokensToMint);
    }


    function getTokenPrice(uint tokenNum) public view returns (uint) {
        uint totalReserve = 0;
        uint256 token1Supply = ERC20(token1).totalSupply();
        uint256 token2Supply = ERC20(token2).totalSupply();
        if (token1Supply != 0 && token2Supply != 0) {
        totalReserve += reversesToken1 * token1Supply;
        totalReserve += reversesToken2 * token2Supply;
        if (tokenNum == 1) {
            return (totalReserve ) / (reversesToken1 * token1Supply);
        } else if (tokenNum == 2){
            return (totalReserve) / (reversesToken2 * token2Supply);
        } else {
            revert("Invalid Num");
        }
    } else {
            return 0;
        }
    }

    modifier amountCheck(uint256 amount) {
        require(amount > 0, "You can't get the Token in the Pool with no amount");
        _;
    }
}