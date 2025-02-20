export type userType = {
    address: string;
    role: "notLogin" | "user";
    balance: {
        eth: string;
        gerda: string;
        krendel: string;
        rtk: string;
        LP: string;
    }
}