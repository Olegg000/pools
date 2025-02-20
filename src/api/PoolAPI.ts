import Pool from "./jsons/Pool.json"
import {ethers} from "ethers"
import {ERC20API} from "./ERC20API";

export class PoolAPI {
    poolAddress: string;
    contract: ethers.Contract;

    static provider: ethers.providers.Web3Provider;
    static signer: ethers.providers.JsonRpcSigner;

    constructor(poolAddress: string) {
        this.poolAddress = poolAddress;
        this.contract = new ethers.Contract(poolAddress, Pool.abi, PoolAPI.signer);  // Контракт на основе конкретного адреса
    }

    static async connect() {
        if (window.ethereum) {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
        } else {
            alert("Please install Metamask!");
        }
    }

    async liquidityTokenAdd(amount: number,tokenNumInput:number) {
        console.log(amount);
        console.log(tokenNumInput);
        const tx = await this.contract.liquidityTokenAdd(amount,tokenNumInput);
        await tx.wait();
    }

    async swapToken( tokenNumInput:number,  amountIn:number) {
        console.log(amountIn);
        console.log(tokenNumInput);
        const tx = await this.contract.swapToken(tokenNumInput, amountIn);
        await tx.wait();
    }
    async getTokenPrice(tokenNum:number) {
        const tokenPrice:number = await this.contract.getTokenPrice(tokenNum);
        return tokenPrice;
    }

    async getReversesNum():Promise<number[]> {
        const reserves:number[] = [];
        const reserve1:number  = await this.contract.reversesToken1();
        const reserve2:number = await this.contract.reversesToken2();
        reserves.push(Number(ethers.BigNumber.from(reserve1)));
        reserves.push(Number(ethers.BigNumber.from(reserve2)));
        return reserves;
    }

    async getReversesAddresses():Promise<string[]> {
        const reserves:string[] = [];
        const reserve1:string  = await this.contract.token1();
        const reserve2:string = await this.contract.token2();
        reserves.push(reserve1);
        reserves.push(reserve2);
        return reserves;
    }

    async getName():Promise<string> {
        return await this.contract.poolName();
    }
    async getOwner():Promise<string> {
        return await this.contract.owner();
    }

    async getTokensNames():Promise<string[]> {
        const tokenNames:string[] = [];
        const token1:string  = await this.contract.token1();
        const token2:string = await this.contract.token2();
        ERC20API.connect()
        const erc20tok1 = new ERC20API(token1);
        const erc20tok2 = new ERC20API(token2);

        const name1:string = await erc20tok1.getName();
        const name2:string = await erc20tok2.getName();
        tokenNames.push(name1);
        tokenNames.push(name2);

        return tokenNames;
    }

    async getTokenReversesInETH():Promise<number[]> {
        const tokenReversesInETH:number[] = [];

        const thisTokenPrice1:number = await this.contract.getTokenPrice(1)
        const thisTokenPrice2:number = await this.contract.getTokenPrice(2)
        if (thisTokenPrice1 != 0) {
            tokenReversesInETH.push(Number(ethers.BigNumber.from(thisTokenPrice1)));
        } else {
            tokenReversesInETH.push(0)
        }
        if (thisTokenPrice2 != 0) {
            tokenReversesInETH.push(Number(ethers.BigNumber.from(thisTokenPrice2)));
        } else {
            tokenReversesInETH.push(0)
        }
        return tokenReversesInETH;
    }

}