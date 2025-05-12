"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface DrawerContextState {
    status: boolean;
    toggleDrawer: (newState: boolean) => void;
}

const DrawerContext = createContext<DrawerContextState>({
    status: false,
    toggleDrawer: () => { },
});

export const DrawerContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [status, setStatus] = useState(false);

    // Toggle function to change the open state
    const toggleDrawer = (newState: boolean) => {
        setStatus(newState);
    };

    return (
        <DrawerContext.Provider value={{ status, toggleDrawer }}>
            {children}
        </DrawerContext.Provider>
    );
};

// Custom hook to use the Drawer context
export const useDrawerContext = () => useContext(DrawerContext);
