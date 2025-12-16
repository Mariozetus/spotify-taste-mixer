'use client';

import { useState, useEffect, useCallback } from 'react';
import { saveTrackForUser, removeTrackForUser } from '@/lib/spotify';
import { useLocalStorage, storageHelpers } from './useLocalStorage';

export function useFavorites() {
    const [favorites, setFavorites] = useLocalStorage('favorite_tracks', []);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const isFavorite = useCallback((trackId) => {
        if (!isClient) return false;
        return favorites.some(f => f.id === trackId);
    }, [favorites, isClient]);

    const toggleFavorite = useCallback(async (track) => {
        if (typeof window === 'undefined') return;
        
        const isFav = favorites.find(f => f.id === track.id);
        let updatedFavorites;

        if (isFav) {
            updatedFavorites = favorites.filter(f => f.id !== track.id);
            try {
                await removeTrackForUser(track.id);
            } catch (error) {
                console.error('Error removing from Spotify:', error);
            }
        } else {
            const optimizedTrack = storageHelpers.tracksToStorage([track])[0];
            updatedFavorites = [...favorites, optimizedTrack];
            try {
                await saveTrackForUser(track.id);
            } catch (error) {
                console.error('Error saving to Spotify:', error);
            }
        }

        setFavorites(updatedFavorites);
    }, [favorites, setFavorites]);

    const removeFavorite = useCallback((trackId) => {
        if (typeof window === 'undefined') return;
        
        const updatedFavorites = favorites.filter(f => f.id !== trackId);
        setFavorites(updatedFavorites);
    }, [favorites, setFavorites]);

    const clearAllFavorites = useCallback(() => {
        if (typeof window === 'undefined') return;
        setFavorites([]);
    }, [setFavorites]);

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearAllFavorites,
        isClient
    };
}
