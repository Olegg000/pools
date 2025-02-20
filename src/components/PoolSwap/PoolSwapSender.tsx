import {poolType} from "../../types/poolType.ts";
import {FC, useState} from "react";
import {ERC20API} from "../../api/ERC20API.ts";
import {PoolAPI} from "../../api/PoolAPI.ts";
import {useDispatch, useSelector} from "react-redux";
import {updatePool} from "../../store/store.ts";

export const PoolSwapSender: FC<{pool: poolType,tokenName1:string,tokenName2:string}> = ({pool,tokenName1,tokenName2}) => {
    const [inputData1,setInputData1] = useState(1)
    const [inputData2,setInputData2] = useState(1)
    const dispatch = useDispatch()

    const swapTokens = async (e: React.FormEvent<HTMLFormElement>, tokenNum:number, inputNum:number, tokenAddr:string) => {
        e.preventDefault()
        e.stopPropagation()
        await ERC20API.connect()
        await PoolAPI.connect()
        const tempERC20 = new ERC20API(tokenAddr)
        const tempPool = new PoolAPI(pool.address)
        try {
            await tempERC20.approve(pool.address,inputNum)
            await tempPool.swapToken(tokenNum,inputNum)
        } catch (e){console.error(e)}
        setInputData1(1)
        setInputData2(1)

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
        dispatch(updatePool(poolCopy))
    }

    return (
     <div>
         <div>
         <p>Обменять {tokenName1} на {tokenName2}</p>
         <form onSubmit={async (e)  => {await swapTokens(e,1,inputData1,pool.addressToken1)}}>
             <input
             type = "number"
             placeholder="Сумма обмена токенов"
             value={inputData1}
             onChange={async (e) => {setInputData1(Number(e.target.value)); setInputData2(Math.round((pool.balance.reserve1/pool.balance.reserve2) * Number(e.target.value)))}}
             step="1"
             min="1"
             required
             />
             <button type="submit">Обменять</button>
             </form>
         </div>
         <div>
             <p>Обменять {tokenName2} на {tokenName1}</p>
             <form onSubmit={async (e)  => {await swapTokens(e,2,inputData2,pool.addressToken2)}}>
                 <input
                     type = "number"
                     placeholder="Сумма обмена токенов"
                     value={inputData2}
                     onChange={async (e) => {setInputData2(Number(e.target.value));setInputData1(Math.round((pool.balance.reserve1/pool.balance.reserve2) * Number(e.target.value)))}}
                     step="1"
                     min="1"
                     required
                 />
                 <button type="submit">Обменять</button>
             </form>
         </div>
     </div>
 )
}