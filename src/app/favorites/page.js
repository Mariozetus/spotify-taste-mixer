'use client'

import { useState, useEffect } from 'react';
import { FaHeart, FaTrash } from "react-icons/fa";
import { FaArrowUpRightFromSquare as RedirectIcon } from "react-icons/fa6";
import { getUserSavedTracks } from '@/lib/spotify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

function SpotifyLikedSongs() {
    const [likedSongs, setLikedSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLikedSongs();
    }, []);

    const { modal: modalSpotify, showModal: showModalSpotify, closeModal: closeModalSpotify } = useModal();
    
    const loadLikedSongs = async () => {
        setIsLoading(true);
        try {
            // Obtener todas las canciones favoritas (sin límite específico, por defecto 50)
            // Para obtener TODAS, usar un número grande como 9999
            const response = await getUserSavedTracks(9999);
            setLikedSongs(response.data.items);
        } catch (error) {
            console.error('Error loading liked songs:', error);
            showModalSpotify('Error', 'Failed to load liked songs from Spotify.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const millisecondsToTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="border border-background-elevated-highlight rounded-lg p-4">
                <div className="space-y-2">
                    {Array.from({ length: 10 }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                            <div className="w-6 h-4 bg-background-elevated-highlight rounded"></div>
                            <div className="w-12 h-12 bg-background-elevated-highlight rounded-md"></div>
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="h-4 bg-background-elevated-highlight rounded w-3/4"></div>
                                <div className="h-3 bg-background-elevated-highlight rounded w-1/2"></div>
                            </div>
                            <div className="h-3 bg-background-elevated-highlight rounded w-12"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (likedSongs.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">💔</div>
                    <h3 className="text-xl font-bold mb-2">No liked songs</h3>
                    <p className="text-text-subdued">
                        Start liking songs on Spotify!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-background-elevated-highlight rounded-lg p-4">
            <div className="space-y-2">
                {likedSongs.map((item, index) => {
                    const track = item.track;
                    return (
                        <div
                            key={track.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-background-elevated-base hover:bg-background-elevated-highlight transition-colors duration-200 group"
                        >
                            <div className="w-6 text-center text-text-subdued text-sm">
                                {index + 1}
                            </div>
                            <img
                                src={track.album?.images?.[0]?.url || '/placeholder-album.png'}
                                alt={track.album?.name}
                                className="w-12 h-12 rounded-md"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium truncate" title={track.name}>
                                        {track.name}
                                    </p>
                                    {track.explicit && (
                                        <span className="px-1 py-0.5 text-xs bg-text-subdued text-background-base rounded">
                                            E
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-text-subdued truncate" title={track.artists?.map(a => a.name).join(', ')}>
                                    {track.artists?.map(a => a.name).join(', ')}
                                </p>
                            </div>
                            <div className="text-sm text-text-subdued">
                                {millisecondsToTime(track.duration_ms)}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <a
                                    href={track.external_urls?.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-background-elevated-press rounded-full transition-colors duration-200"
                                    title="Open in Spotify"
                                >
                                    <RedirectIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <Modal 
                isOpen={modalSpotify.isOpen}
                onClose={closeModalSpotify}
                title={modalSpotify.title}
                message={modalSpotify.message}
                type={modalSpotify.type}
            />
        </div>
    );
}

export default function FavoritesPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const { modal, showModal, closeModal } = useModal();
    const [favorites, setFavorites] = useState([]);
    const [spotifyFavorites, setSpotifyFavorites] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [activeTab, setActiveTab] = useState('local'); // 'local' | 'spotify'
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [trackToRemove, setTrackToRemove] = useState(null);

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const localFavorites = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
            setFavorites(localFavorites);
        }
    }, [isLoading, isAuthenticated, router]);

    const millisecondsToTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    const removeFavorite = (trackId) => {
        if (typeof window === 'undefined') return;
        setTrackToRemove(trackId);
        setShowRemoveConfirm(true);
    };

    const confirmRemove = () => {
        if (trackToRemove) {
            const updatedFavorites = favorites.filter(f => f.id !== trackToRemove);
            setFavorites(updatedFavorites);
            localStorage.setItem('favorite_tracks', JSON.stringify(updatedFavorites));
            showModal('Success', 'Track removed from favorites!', 'success');
        }
        setShowRemoveConfirm(false);
        setTrackToRemove(null);
    };

    const clearAllFavorites = () => {
        if (typeof window === 'undefined') return;
        setShowClearConfirm(true);
    };

    const confirmClearAll = () => {
        setFavorites([]);
        localStorage.setItem('favorite_tracks', JSON.stringify([]));
        setShowClearConfirm(false);
        showModal('Success', 'All favorites cleared successfully!', 'success');
    };

    if (!isClient) {
        return (
            <div className="h-[calc(100vh-4rem)] p-6 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-subdued">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] p-6 flex flex-col gap-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FaHeart className="text-essential-bright-accent" />
                        My Favorites
                    </h1>
                    {activeTab === 'local' && (
                        <p className="text-text-subdued mt-2">
                            {favorites.length} favorite {favorites.length === 1 ? 'track' : 'tracks'}
                        </p>
                    )}
                </div>
                {activeTab === 'local' && favorites.length > 0 && (
                    <button
                        onClick={clearAllFavorites}
                        className="px-4 py-2 rounded-full bg-essential-negative text-white hover:opacity-90 transition-opacity duration-200 font-normal"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-background-elevated-highlight">
                <button
                    onClick={() => setActiveTab('local')}
                    className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${
                        activeTab === 'local'
                            ? 'border-essential-bright-accent text-essential-bright-accent'
                            : 'border-transparent text-text-subdued hover:text-text-base'
                    }`}
                >
                    App Favorites
                </button>
                <button
                    onClick={() => setActiveTab('spotify')}
                    className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${
                        activeTab === 'spotify'
                            ? 'border-essential-bright-accent text-essential-bright-accent'
                            : 'border-transparent text-text-subdued hover:text-text-base'
                    }`}
                >
                    Spotify Liked Songs
                </button>
            </div>

            {/* Content */}
            {activeTab === 'local' && (
                <>
                    {favorites.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl mb-4">💔</div>
                                <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
                                <p className="text-text-subdued">
                                    Start adding tracks to your favorites from the playlists!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-background-elevated-highlight rounded-lg p-4">
                            <div className="space-y-2">
                                {favorites.map((track, index) => (
                                    <div
                                        key={track.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-background-elevated-base hover:bg-background-elevated-highlight transition-colors duration-200 group"
                                    >
                                        {/* Track Number */}
                                        <div className="w-6 text-center text-text-subdued text-sm">
                                            {index + 1}
                                        </div>

                                        {/* Album Cover */}
                                        <img
                                            src={track.album?.images?.[0]?.url || '/placeholder-album.png'}
                                            alt={track.album?.name}
                                            className="w-12 h-12 rounded-md"
                                        />

                                        {/* Track Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium truncate" title={track.name}>
                                                    {track.name}
                                                </p>
                                                {track.explicit && (
                                                    <span className="px-1 py-0.5 text-xs bg-text-subdued text-background-base rounded">
                                                        E
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-text-subdued truncate" title={track.artists?.map(a => a.name).join(', ')}>
                                                {track.artists?.map(a => a.name).join(', ')}
                                            </p>
                                        </div>

                                        {/* Duration */}
                                        <div className="text-sm text-text-subdued">
                                            {millisecondsToTime(track.duration_ms)}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <a
                                                href={track.external_urls?.spotify}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-background-elevated-press rounded-full transition-colors duration-200"
                                                title="Open in Spotify"
                                            >
                                                <RedirectIcon className="w-4 h-4" />
                                            </a>

                                            <button
                                                onClick={() => removeFavorite(track.id)}
                                                className="p-2 hover:bg-background-elevated-press rounded-full transition-colors duration-200"
                                                title="Remove from favorites"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'spotify' && (
                <SpotifyLikedSongs />
            )}

            <ConfirmModal
                isOpen={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                onConfirm={confirmClearAll}
                title="Clear All Favorites"
                message="Are you sure you want to clear all favorites? This action cannot be undone."
                confirmText="Clear All"
            />

            <ConfirmModal
                isOpen={showRemoveConfirm}
                onClose={() => {
                    setShowRemoveConfirm(false);
                    setTrackToRemove(null);
                }}
                onConfirm={confirmRemove}
                title="Remove from Favorites"
                message="Are you sure you want to remove this track from your favorites?"
                confirmText="Remove"
            />

            <Modal 
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
}
