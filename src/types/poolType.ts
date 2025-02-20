export type poolType = {
    address: string,
    name: string,
    owner: string ,
    balance: {
        eth1: number,
        eth2: number,
        reserve1: number,
        reserve2: number,
        nameToken1: string,
        nameToken2: string,
    }
    addressToken1: string,
    addressToken2: string,
}