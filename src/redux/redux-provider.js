"use client";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { setCredentials } from "./slices/authSlice";

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                dispatch(setCredentials({ user }));
            } catch (error) {
                console.error("Failed to parse user from local storage", error);
            }
        }
    }, [dispatch]);

    return <>{children}</>;
};

export const ReduxProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <AuthInitializer>
                {children}
            </AuthInitializer>
        </Provider>
    );
};

