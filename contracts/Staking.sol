// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ERC20.sol";

contract Staking {

    uint8 public rewardPerSecond = 13;
    uint256 SCALE = 1e18;

    mapping(address => uint256) public rewards;
    mapping(address => uint256) public lastRewardsTime;
    mapping(address => uint256) public howMuchStaking;

    mapping(address => uint256) public firstStakingTime;

    uint256 public totalStaking;

    address public LPTokenAddr;

    constructor (address _LPTokenAddr){
        LPTokenAddr = _LPTokenAddr;
    }

    // Функция для стейкинга LP токенов
    function stake(uint amount) public {
        require(amount > 0, "Amount must be greater than zero");

        uint256 currentTime= block.timestamp;
        firstStakingTime[msg .sender] = currentTime;
        lastRewardsTime[msg.sender] = currentTime;
        howMuchStaking[msg.sender] += amount;
        totalStaking += amount;

        ERC20(LPTokenAddr).transferFrom(msg.sender, address(this), amount);
    }

    // Функция для получения вознаграждения
    function claimReward() public {
        rewards[msg.sender] = calculateReward(msg.sender);
        ERC20 lptok = ERC20(LPTokenAddr);
        lptok.mint(msg.sender,rewards[msg.sender]);
        lastRewardsTime[msg.sender] = block.timestamp;

        rewards[msg.sender] = 0;
    }

    // Функция для расчета награды
    function calculateReward(address userAddr) public view returns (uint256 _RW) {
        // ОБЯЗАТЕЛЬНО МЕЖДУ ПРОВЕРКОЙ И ЧЕМ-ТО НУЖНО СОВЕРШИТЬ ТРАНЗАКЦИЮ
        if (howMuchStaking[userAddr] == 0){
            return 0;
        }

        require(userAddr != address(0), "Incorrect address");

        uint256 timeStaked = block.timestamp - lastRewardsTime[userAddr];

        // Если время не прошло, вознаграждение 0
        if (timeStaked == 0) {
            return timeStaked;
        }

        uint256 bonusStake = (howMuchStaking[userAddr] * SCALE) / totalStaking + SCALE;
        uint256 bonusTime = ((((timeStaked * SCALE) / 2592000) * 5) / 100) + SCALE;
        // 2592000 - 30 дней

        uint256 RW = (howMuchStaking[userAddr] * timeStaked * rewardPerSecond * bonusStake * bonusTime)/ (SCALE * SCALE);
        require(RW > 0, "Reward calculated as zero");

        return RW;
    }
}
