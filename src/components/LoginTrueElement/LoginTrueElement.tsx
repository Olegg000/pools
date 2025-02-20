import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Rstore, logOut,setStaking } from "../../store/store.ts";
import {ERC20API} from "../../api/ERC20API.ts";
import Addresses from "../../MainAddresses.json";
import {Staking} from "../Staking/Staking.tsx";

export const LoginTrueElement = () => {
    const user = useSelector((state: Rstore) => state.auth);
    const dispatch = useDispatch();

    const [recipient,setRecipient] = useState("")
    const [amount,setAmount] = useState(0);
    const [tokenAddr,setTokenAddr] = useState("");
    
    const TokenOptions = {
        "RTK": Addresses.rtkAddress,
        "Gerda": Addresses.gerdaAddress,
        "Krendel": Addresses.krendelAddress,
        "LP": Addresses.LPAddress,
    }

    const transfer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!recipient || amount == 0 || !tokenAddr) {
            alert("Please enter amount and recipient and token");
            return;
        }
            await ERC20API.connect();

            const erc20 = new ERC20API(tokenAddr);
            await erc20.transfer(recipient,amount);
    }

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <p>Адрес: {user.address}</p>
                <p>ETH: {user.balance.eth}</p>
                <p>Герда: {user.balance.gerda}</p>
                <p>Крендель: {user.balance.krendel}</p>
                <p>RTK: {user.balance.rtk}</p>
                <p>LP: {user.balance.LP}</p>
            </div>
            <div>
                <button onClick={() => dispatch(logOut())}>Выйти</button>
                {user.address.toLowerCase() == Addresses.ownerAddress.toLowerCase() && (
                    <form onSubmit={transfer}>
                        <input
                            type="text"
                            placeholder="Адрес получателя"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                            />
                        <select
                            value={tokenAddr}
                            onChange={(e) => setTokenAddr(e.target.value)}
                            required
                        >
                            <option value="">Выберете Токен</option>
                            {Object.entries(TokenOptions).map(([name, address]) => (
                                <option key={name} value={address}>{name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Сумма перевода"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            min="1"
                            step="1"
                            required
                        />
                        <button type="submit">Отправить</button>
                    </form>
                )}
            </div>
            {user?.address != "" && (
                <div>
                <Staking userAddr={user.address} />
            </div>
            )}
        </div>
    );
};
