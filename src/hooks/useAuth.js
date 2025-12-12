'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { isAuthenticated, getAccessToken, getValidAccessToken, logout, isTokenExpiringSoon } from "@/lib/auth";

export function useAuth(){
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const intervalRef = useRef(null);

    const checkAuth = useCallback(async () => {
        const authenticated = isAuthenticated();
        
        if (authenticated && isTokenExpiringSoon()) {
            // Intentar refrescar el token
            const newToken = await getValidAccessToken();
            setIsAuth(newToken !== null);
        } else {
            setIsAuth(authenticated);
        }
        
        setIsLoading(false);
    }, []);

    const handleLogout = useCallback(() => {
        logout();
        setIsAuth(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, []);

    useEffect(() => {
        checkAuth();
        
        // Verificar el estado de la sesión cada minuto
        intervalRef.current = setInterval(() => {
            checkAuth();
        }, 60 * 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [checkAuth]);

    return{
        isAuthenticated: isAuth,
        isLoading,
        token: getAccessToken(),
        getValidToken: getValidAccessToken,
        logout: handleLogout,
        refresh: checkAuth
    };
}