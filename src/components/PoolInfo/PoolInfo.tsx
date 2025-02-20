import {Table} from "react-bootstrap"
import {poolType} from "../../types/poolType.ts";
import {FC} from "react";

export const PoolInfo: FC<{pool: poolType}> = ({pool}) => {
    return (
        <div>
            <div>
                <p>Имя пула: <strong>{pool.name}</strong></p>
                <p>Адрес пула: {pool.address}</p>
                <p>Адрес владельца пула: {pool.owner}</p>
            </div>
            <Table>
                <thead>
                <tr>
                    <th>Категория</th>
                    <th>{pool.balance.nameToken1}</th>
                    <th>{pool.balance.nameToken2}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>ETH</th>
                    <th>{pool.balance.eth1}</th>
                    <th>{pool.balance.eth2}</th>
                </tr>
                <tr>
                    <th>Абсолютные величины</th>
                    <th>{pool.balance.reserve1}</th>
                    <th>{pool.balance.reserve2}</th>
                </tr>
                <tr>
                    <th>Адреса</th>
                    <th>{pool.addressToken1}</th>
                    <th>{pool.addressToken2}</th>
                </tr>
                </tbody>
            </Table>
        </div>
    )
}