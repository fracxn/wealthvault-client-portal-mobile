import { create } from "zustand";
import { persist, combine, PersistOptions, createJSONStorage } from "zustand/middleware";
import {
    createSelectorHooks,
    ZustandHookSelectors,
} from "auto-zustand-selectors-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";


type AuthPayload = {
    accessToken: string | null;
    expiryTime: string | null;
    refreshToken: string | null;
    method: any | null;
};

type TwoFAPayload = {
    methods: any[];
    recipient: InitialState["twoFaRecipient"];
    twoFaRequired: boolean
};


type Action = {
    setReset: () => void;
    setUser: (user: InitialState["user"]) => void;
    setToken: (user: InitialState["accessToken"]) => void;
    setAuth: (payload: AuthPayload) => void;
    setTwoFa: (payload: TwoFAPayload) => void;
};

type InitialState = {
    user: User | null;
    accessToken: string | null;
    expiryTime: null | string;
    refreshToken: string | null;
    method: any | null;
    twoFaRequired: boolean;
    twoFaMethods: any[];
    twoFaRecipient: { EMAIL: string; PHONE: string } | null;
    // currentUser: User | null'
};

const initialState: InitialState = {
    user: null,
    accessToken: null,
    expiryTime: null,
    refreshToken: null,
    method: null,
    twoFaRequired: false,
    twoFaMethods: [],
    twoFaRecipient: null,
    // currentUser: null,
};

const reducer = combine(initialState, (set) => ({
    setUser: (user: InitialState["user"]) => set({ user }),
    setToken: (accessToken: InitialState["accessToken"]) => set({ accessToken }),
    setReset: () => {
        set(initialState);
    },
    setAuth: ({ accessToken, expiryTime, refreshToken, method }: AuthPayload) =>
        set({
            accessToken,
            expiryTime,
            refreshToken,
            method,
        }),
    setTwoFa: ({ methods, recipient, twoFaRequired }: TwoFAPayload) =>
        set({
            twoFaRequired: twoFaRequired,
            twoFaMethods: methods,
            twoFaRecipient: recipient,
        }),
}));

type Selector = InitialState & Action;

const persistConfig: PersistOptions<Selector> = {
    name: "auth",
    storage: createJSONStorage(() => AsyncStorage),
};

export const baseReducer = create(persist(reducer, persistConfig));

export const { useSetReset, useSetToken, useUser, useAccessToken, useSetUser, useSetTwoFa, useSetAuth } =
    createSelectorHooks(baseReducer) as typeof baseReducer &
    ZustandHookSelectors<Selector>;

// export const storeFunctions = createSelectorFunctions(
//   baseReducer
// ) as typeof baseReducer & ZustandFuncSelectors<Selector>;
