import {FactoryAPI} from "../../api/factoryAPI.ts";
import {FC, useState} from "react";
import Addresses from "../../MainAddresses.json"
import {useDispatch} from "react-redux";
import {setPool, updatePool} from "../../store/store.ts";

export const CreatePool: FC = () => {
    const dispatch = useDispatch()
    const [dataToken1,setDataToken1] = useState("")
    const [dataToken2,setDataToken2] = useState("")
    const [dataPoolName,setDataPoolName] = useState("")

    const TokenOptions = {
        "Gerda": Addresses.gerdaAddress,
        "RTK": Addresses.rtkAddress,
        "Krendel": Addresses.krendelAddress
    }

    const create = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        await FactoryAPI.connect()
        await FactoryAPI.createPool(dataToken1,dataToken2,dataPoolName)
        const pools = await FactoryAPI.getInfo()
        const correctPool = pools[pools.length -1]
        dispatch(setPool(correctPool))
        setDataPoolName("")
        setDataToken1("")
        setDataToken2("")
    }


    return (
        <div>
            <h1>Создать новый пул</h1>
            <form onSubmit={async (e) => {await create(e)}}>
            <select
                value={dataToken1}
                onChange={(e) => {setDataToken1(e.target.value)}}
                required
            >
                <option value="">Выберете 1 токен</option>
                {Object.entries(TokenOptions).map(([name,address]) => (
                    <option key = {name} value={address}>{name}</option>
                ))}
            </select>
            <select
                value={dataToken2}
                onChange={(e) => {setDataToken2(e.target.value)}}
                required
                >
                <option value="">Выберете 2 токен</option>
                {Object.entries(TokenOptions).map(([name,address]) => (
                    <option key={name} value={address}>{name}</option>
                ))}
            </select>
            <input
                type="string"
                value={dataPoolName}
                placeholder="Введите имя Пула"
                onChange={(e) => {setDataPoolName(e.target.value)}}
                required
            />
            <button type="submit">Создать</button>
            </form>
        </div>
    )
}
