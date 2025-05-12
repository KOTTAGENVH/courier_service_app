"use client";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import userReducer from "../global_redux/feature/userSlice";

// Custom storage for client-side
const createNoopStorage = () => ({
    getItem(/* key: string */) {
        return Promise.resolve(null);
    },
    setItem(key: string, value: string) {
        return Promise.resolve(value);
    },
    removeItem(/* key: string */) {
        return Promise.resolve();
    },
});

const storage =
    typeof window !== "undefined"
        ? createWebStorage("local")
        : createNoopStorage();

// Configuration for user slice persistence
const userPersistConfig = {
    key: "user",
    storage,
};


// Persisted reducers

const userPersistedReducer = persistReducer(userPersistConfig, userReducer);
const store = configureStore({
    reducer: {
        user: userPersistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
