import ReduxToastrLib from "react-redux-toastr"
import { useAuth } from '../hooks/useAuth'
import { useActions } from "../hooks/useActions";
import { useEffect } from "react";
import { getStoreLocal } from "../utils/locale-storage";
import { useLocation } from "react-router-dom";
// import { useRouter } from "next/router";

import { createContext, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const auth = useAuth();
    const [isAuth, setAuth] = useState({});
    const { logout, checkAuth } = useActions();
    const location = useLocation();

    useEffect(() => {
        const accessToken = getStoreLocal('accessToken');
        if (accessToken) checkAuth();
    }, [])

    useEffect(() => {
        const refreshToken = getStoreLocal('refreshToken');
        if (!refreshToken && auth) logout();
    }, [])

    return (
        <AuthContext.Provider value={{ isAuth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}