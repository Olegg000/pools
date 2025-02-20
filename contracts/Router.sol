// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Pool.sol";
import "./Factory.sol";

contract Router {

    Factory public factory;

    mapping(address => address) poolTok;

    constructor(address _factory) {
        factory = Factory(_factory);
    }

    // Поиск пути обмена между двумя токенами
    function findDeepPath(address tokenIn, address tokenOut) private view returns (address intermediateToken, address pool1, address pool2) {
        address[] memory pools = factory.getAllPool();

        // Проходим по всем пулам
        for (uint i = 0; i < pools.length; i++) {
            Pool pool = Pool(pools[i]);
            address token1 = pool.token1();
            address token2 = pool.token2();

            if (token1 == tokenIn || token2 == tokenIn){
                if (tokenIn == token1){
                    intermediateToken = token2;
                } else if (tokenIn == token2){
                    intermediateToken = token1;
                }
                pool1 = pools[i];
                for (uint j; j<pools.length;j++){
                    Pool tempPool = Pool(pools[j]);
                    address tokenTemp1 = tempPool.token1();
                    address tokenTemp2 = tempPool.token2();
                    if ((tokenTemp1 == intermediateToken && tokenTemp2 == tokenOut) || (tokenTemp1 == tokenOut && tokenTemp2 == intermediateToken)){
                    pool2 = pools[j];
                    return(intermediateToken,pool1,pool2);
                    }
                }
            }
        }
        revert("no way");
    }

    function swapTokens(address tokenIn, address tokenOut, uint256 amountIn) public {
        (address intermediateToken,address pool1, address pool2) = findDeepPath(tokenIn,tokenOut);
        Pool Pool1 = Pool(pool1);
        Pool Pool2 = Pool(pool2);
        address token1Pool1 = Pool1.token1();
        address token1Pool2 = Pool2.token1();

        uint256 amountAfterFirstSwap;

        ERC20(tokenIn).transferFrom(msg.sender,address(this),amountIn);
        ERC20(tokenIn).approve(pool1,amountIn);
        require(ERC20(tokenIn).balanceOf(address(this)) == amountIn, "balanceERR");

        if (intermediateToken != token1Pool1){
            Pool1.swapToken(1,amountIn);
        } else {
            Pool1.swapToken(2,amountIn);
        }

        amountAfterFirstSwap = ERC20(intermediateToken).balanceOf(address(this));
        require(amountAfterFirstSwap > 0, "First swap failed");

        ERC20(intermediateToken).approve(address(pool2),amountAfterFirstSwap);

            if (intermediateToken == token1Pool2){
                Pool2.swapToken(1 ,amountAfterFirstSwap);
            } else {
                Pool2.swapToken(2,amountAfterFirstSwap);
            }
        ERC20(tokenOut).transfer(msg.sender, ERC20(tokenOut).balanceOf(address(this)));
    }
}
