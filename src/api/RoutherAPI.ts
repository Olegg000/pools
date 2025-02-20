import Router from "./jsons/Router.json"
import Addresses from "../MainAddresses.json"
import { ethers } from "ethers"
import {ERC20API} from "./ERC20API.ts";


export class RouterAPI {
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
                Addresses.routerAddress,
                Router.abi,
                this.signer,
            )
        } else {
            alert("Please install Metamask!");
        }
    }

    static async swapTokens(addressTokenIn:string,addressTokenOut:string,amount:number) {
                await ERC20API.connect()
                const tempERC20 = new ERC20API(addressTokenIn);
                await tempERC20.approve(Addresses.routerAddress,amount);
                const tx = await this.contract.swapTokens(addressTokenIn, addressTokenOut, amount);
                tx.wait();
    }
}