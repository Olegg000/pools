import { useDispatch, useSelector } from "react-redux";
import {delPool, Rstore, setPool} from "../../store/store";
import React, { useEffect,useState, useRef } from "react";
import {useNavigate} from "react-router-dom";
import {FactoryAPI} from "../../api/factoryAPI.ts";
import {poolType} from "../../types/poolType.ts";
import {PoolInfo} from "../../components/PoolInfo/PoolInfo.tsx";
import {PoolLiquditySender} from "../../components/PoolLiquditySender/PoolLiquditySender.tsx";
import {PoolSwapSender} from "../../components/PoolSwap/PoolSwapSender.tsx";
import {CreatePool} from "../../components/CreatePool/CreatePool.tsx"
import {Router} from "../../components/Router/Router.tsx"
import {Spinner} from "react-bootstrap";

export const PoolsShow = () => {
    const dispatch = useDispatch();
    const user = useSelector((state:Rstore) => state.auth)
    const pools = useSelector((state:Rstore) => state.pool);
    const navigate = useNavigate();
    const [fetchPools, setFetchPools] = useState(false);

    useEffect( () => {
        const fetchPoolsData = async () => {
            if (!fetchPools && pools.length === 0){
                await updatePool()
            }
        }
        if (!fetchPools && pools.length === 0) {
            setFetchPools(true)
            fetchPoolsData()
        }
    }, [fetchPools,dispatch])

    const updatePool = async () => {
        try {
            await FactoryAPI.connect();
            const pools: poolType[] = await FactoryAPI.getInfo();
            dispatch(delPool())
            pools.forEach((pool) => {
                dispatch(setPool(pool))
            });
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "left" }}>
                <button onClick={() => navigate("/Login")}>Логин</button>
            </div>
            <h1>Пулы</h1>
            {pools.length != 0 ? pools.map(pool => (
                <div key={pool.address} style={{border: "1px dotted black"}}>
                    <br/>
                    <div>
                        <PoolInfo pool={pool}/>
                    </div>
                    {user && user.role !== "notLogin" && (
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <PoolLiquditySender pool={pool} tokenAddr={pool.addressToken1} tokenName={pool.balance.nameToken1} tokenNum={1}></PoolLiquditySender>
                            <PoolLiquditySender pool={pool} tokenAddr={pool.addressToken2} tokenName={pool.balance.nameToken2} tokenNum={2}></PoolLiquditySender>
                            </div>
                            <PoolSwapSender pool={pool} tokenName1={pool.balance.nameToken1} tokenName2={pool.balance.nameToken2}></PoolSwapSender>
                            </div>
                    )}
                    <br/>
                    <br/>
                    </div>
            )): <div>загрузка... <Spinner animation="border"></Spinner></div>}

            {user && user.role !== "notLogin" && (
                <div>
                <div>
                    <CreatePool/>
                </div>
                <div>
                    <Router/>
                </div>
                </div>
            )}

        </div>
    )
}