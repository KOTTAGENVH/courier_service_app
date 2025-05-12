"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ShipIDContextState {
    id: string;
    setNewID: (newState: string) => void;
}

const ShipIDContex = createContext<ShipIDContextState>({
    id: "",
    setNewID: () => { },
});

export const ShipIDContexProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [id, setID] = useState("");

    // Toggle function to change the open state
    const setNewID = (newState: string) => {
        setID(newState);
    };

    return (
        <ShipIDContex.Provider value={{ id, setNewID }}>
            {children}
        </ShipIDContex.Provider>
    );
};

// Custom hook to use the ShipID context
export const useShipIDContext = () => useContext(ShipIDContex);
