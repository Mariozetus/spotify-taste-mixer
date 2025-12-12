'use client';

import { useState, useEffect } from "react";
import { getAccessToken  } from "@/lib/auth";

export function useSpotifyUser(){
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        const token = getAccessToken();
        if(!token) {
            setUser(null);
            return;
        }
        
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(response.ok)
            setUser(await response.json());
        else
            setUser(null);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return { user, refresh: fetchUser }; // Exponer refresh
}