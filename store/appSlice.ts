import { create } from "zustand";
import {
    devtools,
    combine,
    persist,
    createJSONStorage,
} from "zustand/middleware";
import {
    createSelectorHooks,
    ZustandFuncSelectors,
    createSelectorFunctions,
    ZustandHookSelectors,
} from "auto-zustand-selectors-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Action = {
    setReset: () => void;
    setCredentials: (value: InitialState["credentials"]) => void;
    setHasSeenOnboarding: (value: InitialState["hasSeenOnboarding"]) => void;
};

type InitialState = {
    credentials: {
        email: string,
        password: string
    } | null;
    hasSeenOnboarding: boolean;
};

const initialState: InitialState = {
    credentials: null,
    hasSeenOnboarding: false,
};

const reducer = combine(initialState, (set) => ({
    setHasSeenOnboarding: (value: InitialState["hasSeenOnboarding"]) =>
        set({ hasSeenOnboarding: value }),
    setCredentials: (value: InitialState["credentials"]) => set({ credentials: value }),
    setReset: () => {
        set(initialState);
    },
}));

// const baseReducer = create(devtools(reducer));
const baseReducer = create(
    persist(reducer, {
        name: "app",
        storage: createJSONStorage(() => AsyncStorage),
    })
);

type Selector = InitialState & Action;

export const {
    useHasSeenOnboarding,
    useSetHasSeenOnboarding,
    useCredentials,
    useSetCredentials
} = createSelectorHooks(baseReducer) as typeof baseReducer &
ZustandHookSelectors<Selector>;

// export const storeFunctions = createSelectorFunctions(
//   baseReducer
// ) as typeof baseReducer & ZustandFuncSelectors<Selector>;
