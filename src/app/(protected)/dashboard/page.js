'use client';

import ArtistWidget from "@/components/widgets/ArtistWidget";
import GenreWidget from "@/components/widgets/GenreWidget";
import TrackWidget from "@/components/widgets/TrackWidget";
import DecadeWidget from "@/components/widgets/DecadeWidget";
import MoodWidget from "@/components/widgets/MoodWidget";
import PopularityWidget from "@/components/widgets/PopularityWidget";
import PlaylistDisplay from "@/components/PlaylistDisplay";
import PlaylistControls from "@/components/PlaylistControls";
import SavePlaylistModal from "@/components/SavePlaylistModal";
import EmptyPlaylistState from "@/components/EmptyPlaylistState";
import Modal from "@/components/Modal";
import { generatePlaylist, savePlaylistToSpotify } from "@/lib/spotify";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardPresets } from "@/hooks/useDashboardPresets";
import { useModal } from "@/hooks/useModal";
import { localStorageUtils, storageHelpers } from "@/hooks/useLocalStorage";

export default function Dashboard() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    
    const {
        artists,
        genres,
        songs,
        decades,
        mood,
        popularity,
        includeFavorites,
        numSongs,
        toggleArtist,
        toggleGenre,
        toggleSong,
        setDecades,
        setMood,
        setPopularity,
        setIncludeFavorites,
        setNumSongs,
        resetArtists,
        resetSongs
    } = useDashboardPresets();
    
    const { modal, showModal, closeModal } = useModal();

    const [playlist, setPlaylist] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);


    useEffect(() => {
        if (typeof window !== 'undefined' && isAuthenticated) {
            const savedPlaylist = localStorageUtils.getItem('current_playlist');
            if (savedPlaylist) {
                try {
                    const { playlist: savedTracks, timestamp } = savedPlaylist;

                    if (Date.now() - timestamp < 60 * 60 * 1000) {
                        setPlaylist(savedTracks);
                        setHasGenerated(true);
                    } 
                    else {
                        localStorageUtils.removeItem('current_playlist');
                    }
                } catch (e) {
                    console.error('Error loading playlist:', e);
                }
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (typeof window !== 'undefined' && playlist.length > 0) {
            const dataToStore = {
                playlist: storageHelpers.tracksToStorage(playlist),
                timestamp: Date.now()
            };
            localStorageUtils.setItem('current_playlist', dataToStore);
        } else if (typeof window !== 'undefined' && playlist.length === 0 && hasGenerated) {
            localStorageUtils.removeItem('current_playlist');
        }
    }, [playlist, hasGenerated]);

    const saveToHistory = (tracks) => {
        if (typeof window === 'undefined' || tracks.length === 0 || tracks.length > 100) return;
        
        try {
            const history = localStorageUtils.getItem('playlist_history', []);
            const newEntry = {
                tracks: storageHelpers.tracksToStorage(tracks),
                timestamp: new Date().toISOString(),
                filters: {
                    artists: artists.length,
                    genres: genres.length,
                    decades: decades.length,
                    tracks: songs.length
                }
            };
            history.unshift(newEntry);
            if (history.length > 20) {
                history.pop();
            }
            localStorageUtils.setItem('playlist_history', history);
        } catch (storageError) {
            console.warn('Could not save to history:', storageError);
            try {
                localStorageUtils.setItem('playlist_history', []);
            } catch (e) {
                console.error('Could not clear history:', e);
            }
        }
    };

    const handleGeneratePlaylist = async () => {
        setIsGenerating(true);
        try {
            const preferences = {
                artists,
                genres,
                tracks: songs,
                decades,
                mood,
                popularity
            };
            
            const generatedTracks = await generatePlaylist(preferences, numSongs, includeFavorites);
            setPlaylist(generatedTracks);
            setHasGenerated(true);
            saveToHistory(generatedTracks);
        } catch (error) {
            console.error('Error generating playlist:', error);
            showModal('Generation Error', 'Error generating playlist. Please try again.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRemoveTrack = (trackId) => {
        setPlaylist(prev => prev.filter(track => track.id !== trackId));
    };

    const handleRefreshPlaylist = () => {
        handleGeneratePlaylist();
    };

    const handleAddMore = async () => {
        setIsGenerating(true);
        try {
            const preferences = {
                artists,
                genres,
                tracks: songs,
                decades,
                mood,
                popularity
            };
            
            const newTracks = await generatePlaylist(preferences, 10, includeFavorites);
            const uniqueNewTracks = newTracks.filter(
                newTrack => !playlist.some(existingTrack => existingTrack.id === newTrack.id)
            );
            setPlaylist(prev => [...prev, ...uniqueNewTracks]);
        } catch (error) {
            console.error('Error adding more tracks:', error);
            showModal('Error', 'Error adding more tracks. Please try again.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveToSpotify = async ({ name, description, cover }) => {
        if (playlist.length === 0) {
            showModal('No Tracks', 'No tracks to save!', 'warning');
            return;
        }

        try {
            const result = await savePlaylistToSpotify(playlist, name, description, cover);
            if (result.success) {
                showModal('Success!', 'Playlist saved to Spotify successfully!', 'success');
                setShowSaveModal(false);
                
                const savedPlaylists = localStorageUtils.getItem('saved_playlists', []);
                savedPlaylists.unshift({
                    id: result.playlistId,
                    name,
                    trackCount: playlist.length,
                    createdAt: new Date().toISOString(),
                    spotifyUrl: result.playlistUrl
                });
                localStorageUtils.setItem('saved_playlists', savedPlaylists.slice(0, 50));
                
                window.open(result.playlistUrl, '_blank');
            }
        } catch (error) {
            console.error('Error saving to Spotify:', error);
            const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error';
            showModal('Save Error', `Error saving playlist to Spotify: ${errorMessage}\n\nMake sure you have the required permissions.`, 'error');
        }
    };

    const handleReorder = (newPlaylist) => {
        setPlaylist(newPlaylist);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] px-3 sm:px-4 md:px-6 lg:overflow-hidden" suppressHydrationWarning>
            <div className="h-full flex flex-col lg:flex-row gap-4 md:gap-6">
                {/* Widgets Section */}
                <div className="flex-1 lg:overflow-y-auto lg:h-full p-1 sm:p-2">
                    <div className="flex flex-col gap-4 md:gap-6 pb-6">
                        <GenreWidget onSelect={toggleGenre} selectedItems={genres}/>
                        <DecadeWidget onSelect={setDecades} selectedItems={decades}/>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <MoodWidget onSelect={setMood} selectedItems={mood}/>
                            <PopularityWidget onSelect={setPopularity} selectedItems={popularity}/>
                            <ArtistWidget onSelect={toggleArtist} selectedItems={artists} onReset={resetArtists}/>
                            <TrackWidget onSelect={toggleSong} selectedItems={songs} artists={artists} onReset={resetSongs}/>
                        </div>
                    </div>
                </div>

                {/* Playlist Section */}
                <div className="w-full lg:w-1/3 lg:h-full p-1 sm:p-2 flex flex-col gap-4 lg:overflow-y-auto">
                    <PlaylistControls
                        numSongs={numSongs}
                        onNumSongsChange={setNumSongs}
                        includeFavorites={includeFavorites}
                        onIncludeFavoritesChange={setIncludeFavorites}
                        onGenerate={handleGeneratePlaylist}
                        isGenerating={isGenerating}
                    />

                    {playlist.length > 0 ? (
                        <PlaylistDisplay
                            playlist={playlist}
                            onRemoveTrack={handleRemoveTrack}
                            onRefresh={handleRefreshPlaylist}
                            onAddMore={handleAddMore}
                            onSaveToSpotify={() => setShowSaveModal(true)}
                            onReorder={handleReorder}
                        />
                    ) : (
                        <EmptyPlaylistState hasGenerated={hasGenerated} />
                    )}
                </div>
            </div>

            <SavePlaylistModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onSave={handleSaveToSpotify}
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