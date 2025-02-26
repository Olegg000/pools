import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { poolType } from "../types/poolType";
import { stakingType } from "../types/stakingType";
import {userType} from "../types/userType";
const initialState = {
    pools: [] as poolType[],
    staking: {} as stakingType,
    users: {
        address: "",
        role: "notLogin",
        balance: {
            eth: "0",
            gerda: "0",
            krendel: "0",
            rtk: "0",
            LP: "0",
        }
    } as userType,
}

const authSlice =createSlice({
    name: "auth",
    initialState: initialState.users,
    reducers: {
        setAuth: (state, action: PayloadAction<typeof initialState.users>) => {
            state.address = action.payload.address;
            state.role = action.payload.role;
            state.balance.eth = action.payload.balance.eth;
            state.balance.gerda = action.payload.balance.gerda;
            state.balance.rtk = action.payload.balance.rtk;
            state.balance.krendel = action.payload.balance.krendel;
            state.balance.LP = action.payload.balance.LP;
        },
        LPAuth: (state, action) => {
            state.balance.LP = action.payload;
        },
        logOut: (state) => {
            state.address = "";
            state.role = "notLogin";
            state.balance = {eth:"",gerda:"",krendel:"",rtk:"",LP:"",}
        }
    }
})

const poolSlice = createSlice({
    name: "pool",
    initialState: initialState.pools,
    reducers: {
        setPool: (state, action: PayloadAction<poolType>) => {
            state.push(action.payload);
        },
        updatePool: (state,action: PayloadAction<poolType>) => {
            const index = state.findIndex((p: poolType) => p.address === action.payload.address);
            state[index] = action.payload;
            },
        delPool: (state) => {
            state.length = 0;
        }
    },})

const stakingSlice = createSlice({
    name: "staking",
    initialState: initialState.staking,
    reducers: {
        setStaking: (state, action) => {
            state.firstStakingTime = action.payload.firstStakingTime;
            state.reward = action.payload.reward;
            state.HowMuchStaking = action.payload.HowMuchStaking;
        },
    },
})

export const { setStaking } = stakingSlice.actions;
export const { setPool } = poolSlice.actions;
export const { setAuth } = authSlice.actions;
export const { logOut } = authSlice.actions;
export const {delPool} = poolSlice.actions;
export const {updatePool} = poolSlice.actions;
export const {LPAuth} = authSlice.actions;

const store = configureStore({
    reducer: {
        pool: poolSlice.reducer,
        staking: stakingSlice.reducer,
        auth: authSlice.reducer,
    }
});

export type Rstore = ReturnType<typeof store.getState>;
export { store };  // экспортируем объект store
