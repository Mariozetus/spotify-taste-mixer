'use client';

import { useState, useEffect, useCallback } from 'react';

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

    // Load presets from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            setHasLoadedPresets(true);
            return;
        }

        try {
            const { data, timestamp } = JSON.parse(stored);
            
            // Check if data is expired
            if (Date.now() - timestamp > EXPIRATION_TIME) {
                localStorage.removeItem(STORAGE_KEY);
                setHasLoadedPresets(true);
                return;
            }
            
            // Load saved presets
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

    // Save presets to localStorage whenever they change
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!hasLoadedPresets) return;

        const dataToStore = {
            data: presets,
            timestamp: Date.now()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
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
