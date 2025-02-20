import staking from "./jsons/Staking.json"
import Addresses from "../MainAddresses.json"
import { ethers } from "ethers"

export class StakingAPI {
    static provider: ethers.providers.Web3Provider;
    static signer: ethers.providers.JsonRpcSigner;
    static contract: ethers.Contract;

    static async connect() {
        if (window.ethereum) {
            // Создаем провайдер для Metamask
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            // получаем подписчика контрактов
            this.signer = this.provider.getSigner();
            this.contract = new ethers.Contract(
                Addresses.stakingAddress,
                staking.abi,
                this.signer,
            )
        } else {
            alert("Please install Metamask!");
        }
    }

    static async stake(amount:number) {
        const tx = await this.contract.stake(amount);
        await tx.wait();
    }

    static async claimReward() {
        const tx = await this.contract.claimReward();
        await tx.wait();
    }

    static async getHowMuchStaking(userAddress:string) {
        const howMuchStaking:number = this.contract.howMuchStaking(userAddress);
        return howMuchStaking;
    }

    static async getFirstStakingTime(userAddr:string):Promise<number> {
        const time = await this.contract.firstStakingTime(userAddr);
        if (time > 0) {
            return time
        } else {
            return 0;
        }
    }

    static async calculateReward(userAddr:string) {
        const reward = await this.contract.calculateReward(userAddr);
        console.log(Number(reward));
        return reward;
    }

    static async getStakingInfo(userAddress:string):Promise<{firstStakingTime: number, reward: number, HowMuchStaking: number}> {
        const firstStakingTime:number = Number(await StakingAPI.getFirstStakingTime(userAddress)) ?? 0;
        const reward:number = Number(await StakingAPI.calculateReward(userAddress));
        const getHowMuchStaking:number = Number(await StakingAPI.getHowMuchStaking(userAddress)) ?? 0;

        return {
            firstStakingTime: firstStakingTime,
            reward: reward,
            HowMuchStaking: getHowMuchStaking
        };
    }
}