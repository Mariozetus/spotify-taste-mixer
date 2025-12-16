'use client';

import { useState, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            
            setStoredValue(valueToStore);
            
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } 
        catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
            }
        } 
        catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
}


export const localStorageUtils = {
    getItem: (key, defaultValue = null) => {
        if (typeof window === 'undefined') 
            return defaultValue;
        
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } 
        catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    },

    setItem: (key, value) => {
        if (typeof window === 'undefined') return;
        
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } 
        catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    },

    removeItem: (key) => {
        if (typeof window === 'undefined') return;
        
        try {
            localStorage.removeItem(key);
        } 
        catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    },

    getRaw: (key, defaultValue = null) => {
        if (typeof window === 'undefined') 
            return defaultValue;
        return localStorage.getItem(key) || defaultValue;
    },

    setRaw: (key, value) => {
        if (typeof window === 'undefined') 
            return;
        localStorage.setItem(key, value);
    }
};

/**
 * Helper functions to optimize storage by saving only IDs
 */
export const storageHelpers = {
    // Convert track objects to lightweight storage format (only IDs and essential data)
    tracksToStorage: (tracks) => {
        return tracks.map(track => ({
            id: track.id,
            name: track.name,
            artists: track.artists?.map(a => ({ id: a.id, name: a.name })) || [],
            album: track.album ? { 
                id: track.album.id, 
                name: track.album.name,
                images: track.album.images 
            } : null,
            duration_ms: track.duration_ms,
            uri: track.uri
        }));
    },

    // Convert artist objects to lightweight format
    artistsToStorage: (artists) => {
        return artists.map(artist => ({
            id: artist.id,
            name: artist.name,
            images: artist.images?.[0] ? [artist.images[0]] : []
        }));
    },

    // Convert song objects to lightweight format
    songsToStorage: (songs) => {
        return songs.map(song => ({
            id: song.id,
            name: song.name,
            artists: song.artists?.map(a => ({ id: a.id, name: a.name })) || [],
            album: song.album?.images?.[0] ? { 
                images: [song.album.images[0]] 
            } : null
        }));
    }
};
