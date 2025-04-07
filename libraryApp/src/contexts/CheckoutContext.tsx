// to share the checkout state across the app
import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserType = "student" | "faculty";

export interface CheckoutItem {
    ItemID: number;
    ItemType: string;
    Title: string;
    CheckoutDate: string;
    DueDate: string;
}

interface CheckoutContextProps {
    cart: CheckoutItem[];
    addToCart: (item: CheckoutItem) => void;
    userType: UserType;
    setUserType: (type: UserType) => void;
}

const CheckoutContext = createContext<CheckoutContextProps | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CheckoutItem[]>([]);
    const [userType, setUserType] = useState<UserType>("student");

    const addToCart = (item: CheckoutItem) => setCart((prev) => [...prev, item]);

    return (
        <CheckoutContext.Provider value={{ cart, addToCart, userType, setUserType }}>
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (!context) throw new Error("useCheckout must be used within CheckoutProvider");
    return context;
};
