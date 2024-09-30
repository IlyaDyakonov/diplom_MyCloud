import { createContext } from 'react';

export default createContext({
    currentStorageUser: Number(),
    setCurrentStorageUser: () => { },
});