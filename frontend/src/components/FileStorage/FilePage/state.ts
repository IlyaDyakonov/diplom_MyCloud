import { createContext } from 'react';
// import GlobalState from '../../models';

// export default createContext({
//     currentStorageUser: Number(),
//     setCurrentStorageUser: () => { },
// });
export interface GlobalState {
    sessionId: number;
    setSessionId: (id: number) => void;
    username: string;
    setUsername: (name: string) => void;
    isAdmin: boolean;
    setIsAdmin: (isAdmin: boolean) => void;
    currentStorageUser: number;
    setCurrentStorageUser: (userId: number) => void;
}

const GlobalStateContext = createContext < GlobalState > ({
    sessionId: 0,
    setSessionId: () => { },
    username: '',
    setUsername: () => { },
    isAdmin: false,
    setIsAdmin: () => { },
    currentStorageUser: 0,
    setCurrentStorageUser: () => { },
});

export default GlobalStateContext;
