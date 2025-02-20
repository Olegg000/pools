import React, {useState, useEffect} from "react";
import { Users } from "../../components/Users/Users";
import { ethers } from "ethers";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {Rstore} from "../../store/store.ts";

export const Login = () => {
    const user = useSelector((state:Rstore) => state.auth)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const checkMetaMask = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);

                if (accounts.length) {
                    setIsLoggedIn(true);
                } else {
                    alert("Вы не авторизовались в MetaMask");
                }
            } catch (e) {
                console.error("Ошибка подключения MetaMask:", e);
            }
        } else {
            alert("Установите MetaMask!");
        }
    };

    useEffect(() => {
        if (user.address != "") {
            setIsLoggedIn(true);
        }
        if (user.address == "") {
            setIsLoggedIn(false);
        }
    }, [user]);

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "left" }}>
                <button onClick={() => navigate("/")}>К пулам</button>
            </div>
            {!isLoggedIn && <button onClick={checkMetaMask}>Login with MetaMask</button>}
            {isLoggedIn && <Users />}
        </div>
    );
};
