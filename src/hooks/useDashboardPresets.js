'use client';

import { useState, useEffect, useCallback } from 'react';
import { localStorageUtils, storageHelpers } from './useLocalStorage';

const STORAGE_KEY = 'dashboard_presets';
const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

const defaultPresets = {
    artists: [],
    genres: [],
    songs: [],
    decades: [],
    mood: null,
    popularity: { min: 0, max: 100 },
    includeFavorites: false,
    numSongs: 30
};

export function useDashboardPresets() {
    const [presets, setPresets] = useState(defaultPresets);
    const [hasLoadedPresets, setHasLoadedPresets] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const stored = localStorageUtils.getItem(STORAGE_KEY);
        if (!stored) {
            setHasLoadedPresets(true);
            return;
        }

        try {
            const { data, timestamp } = stored;
            
            if (Date.now() - timestamp > EXPIRATION_TIME) {
                localStorageUtils.removeItem(STORAGE_KEY);
                setHasLoadedPresets(true);
                return;
            }
            
            setPresets(prev => ({
                ...prev,
                ...data
            }));
            
            setHasLoadedPresets(true);
        } catch (e) {
            console.error('Error loading presets:', e);
            setHasLoadedPresets(true);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!hasLoadedPresets) return;

        const dataToStore = {
            data: {
                artists: storageHelpers.artistsToStorage(presets.artists),
                genres: presets.genres,
                songs: storageHelpers.songsToStorage(presets.songs),
                decades: presets.decades,
                mood: presets.mood,
                popularity: presets.popularity,
                includeFavorites: presets.includeFavorites,
                numSongs: presets.numSongs
            },
            timestamp: Date.now()
        };

        localStorageUtils.setItem(STORAGE_KEY, dataToStore);
    }, [presets, hasLoadedPresets]);

    const updatePreset = useCallback((key, value) => {
        setPresets(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const toggleArtist = useCallback((artist) => {
        setPresets(prev => {
            const isIncluded = prev.artists.some(item => item.id === artist.id);
            return {
                ...prev,
                artists: isIncluded 
                    ? prev.artists.filter(item => item.id !== artist.id)
                    : [...prev.artists, artist]
            };
        });
    }, []);

    const toggleGenre = useCallback((genre) => {
        setPresets(prev => {
            const isIncluded = prev.genres.includes(genre);
            return {
                ...prev,
                genres: isIncluded 
                    ? prev.genres.filter(item => item !== genre)
                    : [...prev.genres, genre]
            };
        });
    }, []);

    const toggleSong = useCallback((song) => {
        setPresets(prev => {
            const isIncluded = prev.songs.some(item => item.id === song.id);
            return {
                ...prev,
                songs: isIncluded 
                    ? prev.songs.filter(item => item.id !== song.id)
                    : [...prev.songs, song]
            };
        });
    }, []);

    const resetArtists = useCallback(() => {
        setPresets(prev => ({ ...prev, artists: [] }));
    }, []);

    const resetSongs = useCallback(() => {
        setPresets(prev => ({ ...prev, songs: [] }));
    }, []);

    return {
        ...presets,
        hasLoadedPresets,
        updatePreset,
        toggleArtist,
        toggleGenre,
        toggleSong,
        resetArtists,
        resetSongs,
        setDecades: (decades) => updatePreset('decades', decades),
        setMood: (mood) => updatePreset('mood', mood),
        setPopularity: (popularity) => updatePreset('popularity', popularity),
        setIncludeFavorites: (value) => updatePreset('includeFavorites', value),
        setNumSongs: (value) => updatePreset('numSongs', value)
    };
}
