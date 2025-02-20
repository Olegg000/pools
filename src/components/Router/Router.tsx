import {RouterAPI} from "../../api/RoutherAPI.ts";
import Addresses from "../../MainAddresses.json"
import React, {FC, useState} from "react";
import {FactoryAPI} from "../../api/factoryAPI.ts";
import {useDispatch} from "react-redux";
import {delPool, setPool} from "../../store/store.ts";

export const Router: FC = () => {
    const [amount, setAmount] = useState(0);
    const [Token1, setToken1] = useState("");
    const [Token2, setToken2] = useState("");
    const dispatch = useDispatch();

    const TokenOptions = {
        "RTK": Addresses.rtkAddress,
        "Gerda": Addresses.gerdaAddress,
        "Krendel": Addresses.krendelAddress,
    }

    const routing = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        await RouterAPI.connect()
        await RouterAPI.swapTokens(Token1,Token2,amount)
        await FactoryAPI.connect()
        dispatch(delPool())
        const pools = await FactoryAPI.getInfo()
        pools.forEach(pool => {
            dispatch(setPool(pool))
        })

        setAmount(0)
        setToken1("")
        setToken2("")
    }

    return (
        <div>
            <h1>Router: </h1>
            <form onSubmit={async e => { await routing(e)}}>
                <select
                    value={Token1}
                    onChange={e => setToken1(e.target.value)}
                    required>
                    <option value="">Выберете 1 токен</option>
                    {Object.entries(TokenOptions).map(([name,address]) => (
                        <option key={name} value={address}>{name}</option>
                    ))}
                </select>
                <select
                    value={Token2}
                    onChange={e => setToken2(e.target.value)}
                    required>
                    <option value="">Выберете 2 токен</option>
                    {Object.entries(TokenOptions).map(([name, address]) => (
                        <option key={name} value={address}>{name}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Введите сумму для обмена"
                    value={amount}
                    onChange={e => setAmount(+e.target.value)}
                    min="1"
                    step="1"
                    required
                    />
                <button type="submit">Обменять</button>
            </form>
        </div>
    )
}


