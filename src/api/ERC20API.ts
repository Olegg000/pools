import ERC20 from "./jsons/ERC20.json"
import { ethers } from "ethers"

export class ERC20API {
    poolAddress: string;
    contract: ethers.Contract;

    static provider: ethers.providers.Web3Provider;
    static signer: ethers.providers.JsonRpcSigner;

    constructor(ERC20Address: string) {
        this.poolAddress = ERC20Address;
        this.contract = new ethers.Contract(ERC20Address, ERC20.abi, ERC20API.signer);  // Контракт на основе конкретного адреса
    }

    // Метод для подключения к Metamask
    static async connect() {
        if (window.ethereum) {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
        } else {
            alert("Please install Metamask!");
        }

    }

    async getName(): Promise<string> {
            return await this.contract.name();
    }

    async approve(spenderAddr:string, value:number) {
        const tx = await this.contract.approve(spenderAddr, value);
        return tx;
    }

    async getBalance(userAddress: string): Promise<number> {
        let balance = 0;
        try {
            balance = await this.contract.balanceOf(userAddress);
            if (balance == 0) {
                console.log(`Токенов на адресе ${userAddress} нет.`);
            }
        } catch (e) {
            throw e;
        }
        return balance;
    }

    async transfer(userAddress: string, amount: number): Promise<boolean> {
        return await this.contract.transfer(userAddress, amount);
    }
}
