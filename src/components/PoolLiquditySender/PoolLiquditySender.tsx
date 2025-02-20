import {poolType} from "../../types/poolType.ts";
import {FC, useState} from "react";
import {ERC20API} from "../../api/ERC20API.ts";
import {PoolAPI} from "../../api/PoolAPI.ts";
import {Rstore, updatePool} from "../../store/store.ts";
import {useDispatch} from "react-redux";

export const PoolLiquditySender: FC<{pool: poolType, tokenAddr: string, tokenName: string, tokenNum: number}> = ({pool, tokenAddr, tokenName,tokenNum}) => {
    const [inputData,setInputData] = useState(1)
    const dispatch = useDispatch()

    const poolLiqudityAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        await ERC20API.connect()
        await PoolAPI.connect()
        const tempPool = new PoolAPI(pool.address)
        const tempERC20 = new ERC20API(tokenAddr);

        await tempERC20.approve(pool.address,inputData)
        await tempPool.liquidityTokenAdd(inputData,tokenNum)

        const poolCopy = {...pool}
        poolCopy.balance = {...pool.balance}
        let tempETH = []
        try {
            tempETH = await tempPool.getTokenReversesInETH();
        } catch (error) {
            tempETH = [0,0]
        }

        const tempReserves = await tempPool.getReversesNum()
        poolCopy.balance.eth1 = Number(tempETH[0])
        poolCopy.balance.eth2 = Number(tempETH[1])
        poolCopy.balance.reserve1 = tempReserves[0]
        poolCopy.balance.reserve2 = tempReserves[1]
        setInputData(1)
        dispatch(updatePool(poolCopy))
    }

    return (
        <div>
            <p>Поддержать ликвидность пула {pool.name}, отдав {tokenName}</p>
            <form onSubmit={async (e) => {await poolLiqudityAdd(e)}}>
                <input
                type = "number"
                placeholder= "Сумма поддержки ликвидности"
                value={inputData}
                onChange={(e) => {setInputData(Number(e.target.value))}}
                step = "1"
                min = "1"
                required
                />
                <button type="submit">Поддержать</button>
            </form>
        </div>
    )
}