'use client'

import { useState, useEffect } from 'react';
import { FaHistory, FaTrash, FaPlay, FaSpotify, FaPencilAlt } from "react-icons/fa";
import { FaArrowUpRightFromSquare as RedirectIcon } from "react-icons/fa6";
import { savePlaylistToSpotify } from '@/lib/spotify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

export default function HistoryPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const { modal, showModal, closeModal } = useModal();
    const [history, setHistory] = useLocalStorage('playlist_history', []);
    const [isClient, setIsClient] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [playlistToRemove, setPlaylistToRemove] = useState(null);

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        setIsClient(true);
    }, [isLoading, isAuthenticated, router]);

    const millisecondsToTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    const removePlaylist = (index) => {
        if (typeof window === 'undefined') return;
        setPlaylistToRemove(index);
        setShowRemoveConfirm(true);
    };

    const confirmRemove = () => {
        if (playlistToRemove !== null) {
            const updatedHistory = history.filter((_, i) => i !== playlistToRemove);
            setHistory(updatedHistory);
            if (selectedPlaylist === playlistToRemove) {
                setSelectedPlaylist(null);
            }
            showModal('Success', 'Playlist removed from history!', 'success');
        }
        setShowRemoveConfirm(false);
        setPlaylistToRemove(null);
    };

    const clearAllHistory = () => {
        if (typeof window === 'undefined') return;
        setShowClearConfirm(true);
    };

    const confirmClearAll = () => {
        setHistory([]);
        setSelectedPlaylist(null);
        setShowClearConfirm(false);
        showModal('Success', 'All history cleared successfully!', 'success');
    };

    const handleSaveToSpotify = async (playlist) => {
        try {
            const result = await savePlaylistToSpotify(
                playlist.tracks,
                playlist.name || 'My Taste Mix',
                'Created with Spotify Taste Mixer from history'
            );
            if (result.success) {
                showModal('Success!', 'Playlist saved to Spotify successfully!', 'success');
                window.open(result.playlistUrl, '_blank');
            }
        } catch (error) {
            console.error('Error saving to Spotify:', error);
            const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error';
            showModal('Save Error', `Error saving playlist to Spotify: ${errorMessage}`, 'error');
        }
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
        <div className="h-[calc(100vh-4rem)] p-3 sm:p-4 md:p-6 flex flex-col gap-4 md:gap-6 overflow-y-auto">
            {/* ========================= HEADER ========================= */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                        <FaHistory className="text-essential-bright-accent" />
                        Playlist History
                    </h1>
                    <p className="text-text-subdued mt-1 sm:mt-2 text-sm sm:text-base">
                        {history.length} playlist{history.length === 1 ? '' : 's'} generated
                    </p>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={clearAllHistory}
                        className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base rounded-full bg-essential-negative text-white hover:opacity-90 transition-opacity duration-200 font-normal cursor-pointer"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* ========================= CONTENT ========================= */}
            {history.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h3 className="text-lg sm:text-xl font-bold mb-2">No playlist history</h3>
                        <p className="text-text-subdued text-sm sm:text-base">
                            Generate playlists from the dashboard to see them here!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* ========================= PLAYLIST DISPLAY ========================= */}
                    <div className="space-y-3 sm:space-y-4">
                        {history.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedPlaylist(index)}
                                className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 ${
                                    selectedPlaylist === index
                                        ? 'border-essential-bright-accent bg-background-elevated-highlight'
                                        : 'border-background-elevated-highlight hover:bg-background-elevated-base'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-base sm:text-lg truncate">
                                            {item.name || `Playlist ${history.length - index}`}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-text-subdued">
                                            {new Date(item.timestamp).toLocaleDateString()} at{' '}
                                            {new Date(item.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removePlaylist(index);
                                        }}
                                        className="p-1.5 sm:p-2 cursor-pointer hover:bg-background-elevated-press rounded-full transition-colors duration-200"
                                        title="Remove from history"
                                    >
                                        <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-text-subdued flex-wrap">
                                    <span>{item.tracks.length} tracks</span>
                                    {item.filters && (
                                        <>
                                            {item.filters.artists > 0 && <span>{item.filters.artists} artists</span>}
                                            {item.filters.genres > 0 && <span>{item.filters.genres} genres</span>}
                                            {item.filters.decades > 0 && <span>{item.filters.decades} decades</span>}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ========================= PLAYLIST DETAILS ========================= */}
                    {selectedPlaylist !== null && history[selectedPlaylist] && (
                        <div className="border border-background-elevated-highlight rounded-lg p-3 sm:p-4 lg:sticky lg:top-6 self-start">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-3">
                                <h2 className="text-lg sm:text-xl font-bold">
                                    {history[selectedPlaylist].name || `Playlist ${history.length - selectedPlaylist}`}
                                </h2>
                                <button
                                    onClick={() => handleSaveToSpotify(history[selectedPlaylist])}
                                    className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full bg-essential-bright-accent text-background-base hover:opacity-90 transition-opacity cursor-pointer duration-200 font-medium flex items-center justify-center gap-2"
                                >
                                    <FaSpotify className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline ">Save to Spotify</span>
                                    <span className="sm:hidden">Save</span>
                                </button>
                            </div>

                            <div className="space-y-1 sm:space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
                                {history[selectedPlaylist].tracks.map((track, idx) => (
                                    <div
                                        key={track.id}
                                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-background-elevated-base hover:bg-background-elevated-highlight transition-colors duration-200 group"
                                    >
                                        <div className="w-4 sm:w-6 text-center text-text-subdued text-xs sm:text-sm">
                                            {idx + 1}
                                        </div>
                                        <img
                                            src={track.album?.images?.[0]?.url || '/placeholder-album.png'}
                                            alt={track.album?.name}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-md"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1 sm:gap-2">
                                                <p className="font-medium text-xs sm:text-base truncate" title={track.name}>
                                                    {track.name}
                                                </p>
                                                {track.explicit && (
                                                    <span className="px-1 py-0.5 text-xs bg-text-subdued text-background-base rounded shrink-0">
                                                        E
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm text-text-subdued truncate" title={track.artists?.map(a => a.name).join(', ')}>
                                                {track.artists?.map(a => a.name).join(', ')}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block text-sm text-text-subdued">
                                            {millisecondsToTime(track.duration_ms)}
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <a
                                                href={track.external_urls?.spotify}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 sm:p-2 hover:bg-background-elevated-press rounded-full transition-colors duration-200"
                                                title="Open in Spotify"
                                            >
                                                <RedirectIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <ConfirmModal
                isOpen={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                onConfirm={confirmClearAll}
                title="Clear All History"
                message="Are you sure you want to clear all playlist history? This action cannot be undone."
                confirmText="Clear All"
            />

            <ConfirmModal
                isOpen={showRemoveConfirm}
                onClose={() => {
                    setShowRemoveConfirm(false);
                    setPlaylistToRemove(null);
                }}
                onConfirm={confirmRemove}
                title="Remove Playlist"
                message="Are you sure you want to remove this playlist from history?"
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
