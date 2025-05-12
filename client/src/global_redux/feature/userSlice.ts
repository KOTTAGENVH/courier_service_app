'use client';
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    telephone: string;
}

const getInitialUserState = (): UserState => {
    if (typeof localStorage !== "undefined") {
        const persistedState = localStorage.getItem("userState");
        if (persistedState) {
            return JSON.parse(persistedState);
        }
    }
    return { firstName: "", lastName: "", email: "", address: "", telephone: "" };
};

export const userSlice = createSlice({
    name: "userdetails",
    initialState: getInitialUserState(),
    reducers: {
        setUserDetails: (state, action: PayloadAction<UserState>) => {
            const newState = {
                ...state,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                email: action.payload.email,
                address: action.payload.address,
                telephone: action.payload.telephone,
            };
            if (typeof localStorage !== "undefined") {
                localStorage.setItem("userState", JSON.stringify(newState));
            }
            return newState;
        },
        setLogout: () => {
            const newState = {
                firstName: "",
                lastName: "",
                email: "",
                address: "",
                telephone: "",
            };
            if (typeof localStorage !== "undefined") {
                localStorage.setItem("userState", JSON.stringify(newState));
            }
            return newState;
        },
    },
});

export const { setUserDetails, setLogout } = userSlice.actions;
export default userSlice.reducer;
