import React, {FC, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {StakingAPI} from "../../api/StakingAPI.ts";
import {setStaking,LPAuth} from "../../store/store.ts";
import {Table} from "react-bootstrap";
import {Rstore} from "../../store/store.ts";
import Addresses from "../../MainAddresses.json"
import {ERC20API} from "../../api/ERC20API.ts";

export const Staking: FC<{userAddr: string}> = ({userAddr}) => {
    const dispatch = useDispatch()
    const [amount, setAmount] = useState(1)
    const staking = useSelector((state: Rstore) => state.staking)
    const user = useSelector((state: Rstore) => state.auth)

    const setInfo = async () => {
        await StakingAPI.connect()
        const stakInfo = await StakingAPI.getStakingInfo(userAddr)
        dispatch(setStaking(stakInfo))
    }

    const giveAmount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        await ERC20API.connect()
        const tempERC20 = new ERC20API(Addresses.LPAddress)
        await tempERC20.approve(Addresses.stakingAddress, amount)
        await StakingAPI.connect()
        await StakingAPI.stake(amount)
        await setInfo()
    }
    const getReward = async () => {
        if (staking.reward != 0) {
            await StakingAPI.connect()
            await StakingAPI.claimReward()
            await setInfo()
            const tempERC20 = new ERC20API(Addresses.LPAddress)
            const finalLPAmount = await tempERC20.getBalance(user.address)
            dispatch(LPAuth(Number(finalLPAmount)))
        } else {
            alert("Нет вознаграждения")
        }
    }

    useEffect(() => {
       setInfo()
    },[])

    return (
        <div>
            <div>
            <h1>Staking: </h1>
            <Table>
                <thead>
                <tr>
                    <th>Время вложения</th>
                    <th>Награда стейкинга</th>
                    <th>Сколько вложено</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>{staking.firstStakingTime? new Date(staking.firstStakingTime * 1000).toLocaleString() : "Не задано"}</th>
                    <th>{staking.reward}</th>
                    <th>{staking.HowMuchStaking}</th>
                </tr>
                </tbody>
            </Table>
            </div>
            <div>
                <p>Положить ЛП токены на Стейкинг</p>
                <form onSubmit={async (e) => {await giveAmount(e)}}>
                    <input
                        type="number"
                        placeholder="Введите сумму ЛП токенов"
                        value={amount}
                        onChange={e => setAmount(+e.target.value)}
                        min="1"
                        step="1"
                        required
                    />
                    <button type="submit">Положить</button>
                </form>
            </div>
            <br/>
            <p>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</p>
            <div>
                <p>Забрать ЛП токены со стейкинга</p>
                <button onClick={async (e) => {await getReward()}}>Забрать</button>
            </div>
        </div>
    )
}