import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {logOut, Rstore, setAuth} from "../../store/store";
import { ERC20API } from "../../api/ERC20API";
import Addresses from "../../MainAddresses.json";
import { ethers } from "ethers";
import {LoginTrueElement} from "../LoginTrueElement/LoginTrueElement.tsx";

export const Users: React.FC = () => {
    const user = useSelector((state: Rstore) => state.auth); // Используем данные из Redux
    const dispatch = useDispatch();

    const fetchUserData = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            if (!accounts || !accounts.length) {
                dispatch(logOut())
            }
            const account = accounts[0];

            const ethBalanceBN = await provider.getBalance(account);
            const ethBalance = ethers.utils.formatEther(ethBalanceBN);
            let balance = {eth: ethBalance.toString(), gerda: "0", krendel: "0",rtk: "0", LP: "0"};

        try {
            await ERC20API.connect();
                const gerda = new ERC20API(Addresses.gerdaAddress)
                const krendel = new ERC20API(Addresses.krendelAddress)

                const rtk = new ERC20API(Addresses.rtkAddress)
                const LP = new ERC20API(Addresses.LPAddress)

            balance.gerda = (await gerda.getBalance(account)).toString()
            balance.krendel = (await krendel.getBalance(account)).toString()
            balance.rtk = (await rtk.getBalance(account)).toString()
            balance.LP = (await LP.getBalance(account)).toString()
        } catch (e) {
            console.log(e)
        }


            dispatch(setAuth({address: account, role: "user", balance: balance}));
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (!user.address) {
            fetchUserData();
        }
    }, [dispatch]);

    return (
        <LoginTrueElement></LoginTrueElement>
    )
}