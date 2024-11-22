import { createContext, useContext } from 'react';


export interface GlobalState {
    globalStorageUser: number | null;
    setCurrentStorageUser: (userId: number) => void;
}

const GlobalStateContext = createContext < GlobalState > ({
    globalStorageUser: null,
    setCurrentStorageUser: () => { },
});

export const useGlobalState = () => useContext(GlobalStateContext);
