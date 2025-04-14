import { createContext, useContext, useState } from 'react';

type RefreshContextType = {
    refreshInventory: boolean;
    setRefreshInventory: (val: boolean) => void;
};

const RefreshContext = createContext<RefreshContextType>({
    refreshInventory: false,
    setRefreshInventory: () => { },
});

export const RefreshProvider = ({ children }: { children: React.ReactNode }) => {
    const [refreshInventory, setRefreshInventory] = useState(false);

    return (
        <RefreshContext.Provider value={{ refreshInventory, setRefreshInventory }}>
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => useContext(RefreshContext);
