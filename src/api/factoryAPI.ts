import fabric from "./jsons/Factory.json"
import Addresses from "../MainAddresses.json"
import { ethers } from "ethers"
import {PoolAPI} from "./PoolAPI";
import {poolType} from "../types/poolType.ts";

export class FactoryAPI {
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
                Addresses.factoryAddress,
                fabric.abi,
                this.signer,
            )
        } else {
            alert("Please install Metamask!");
        }
    }

    static async getAllPools() {
        const allPools:string[] = await this.contract.getAllPool();
        return allPools;
    }

    static async createPool( token1:string,  token2:string,   poolName:string) {
        const tx = await this.contract.createPool(token1, token2, poolName);
        await tx.wait();
    }

    static async getInfo():Promise<poolType[]> {
        const poolsInfo = [];
        const poolAddresses:string[] = await FactoryAPI.getAllPools();


        for (let i = 0; i < poolAddresses.length; ++i) {
            try {
                const poolAddress = poolAddresses[i];

                PoolAPI.connect();
                const pool = new PoolAPI(poolAddress);

                let poolTokensReservesInETH:number[] = [];


                const poolName = await pool.getName() ?? "unknown";
                const poolOwner = await pool.getOwner() ?? "unknown";
                const poolReserves = await pool.getReversesNum() ?? [0,0];
                const poolTokenNames = await pool.getTokensNames() ?? ['',''];
                try {
                    poolTokensReservesInETH = await pool.getTokenReversesInETH();
                } catch (error) {
                    poolTokensReservesInETH = [0,0]
                }
                const poolTokenAddresses = await pool.getReversesAddresses() ?? ["",""];

                poolsInfo.push({
                    address: poolAddress,
                    name: poolName,
                    owner: poolOwner,
                    balance: {
                        eth1: poolTokensReservesInETH[0],
                        eth2: poolTokensReservesInETH[1],
                        reserve1: poolReserves[0],
                        reserve2: poolReserves[1],
                        nameToken1: poolTokenNames[0],
                        nameToken2: poolTokenNames[1],
                    },
                    addressToken1: poolTokenAddresses[0],
                    addressToken2: poolTokenAddresses[1],
                });
            } catch (error) {
                console.log(error);
            }
        }
        return poolsInfo;
    }
}
