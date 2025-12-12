'use client'

import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaTrash, FaSync, FaPlus, FaSpotify, FaGripVertical, FaEllipsisH } from "react-icons/fa";
import { FaArrowUpRightFromSquare as RedirectIcon} from "react-icons/fa6";
import { saveTrackForUser, removeTrackForUser } from '@/lib/spotify';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableTrack({ track, index, isFavorite, onToggleFavorite, onRemove, millisecondsToTime }) {
    const [showMenu, setShowMenu] = useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: track.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-background-elevated-base hover:bg-background-elevated-highlight transition-colors duration-200 group"
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-text-subdued hover:text-text-base transition-colors touch-manipulation"
            >
                <FaGripVertical className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>

            {/* Track Number */}
            <div className="w-4 sm:w-6 text-center text-text-subdued text-xs sm:text-sm">
                {index + 1}
            </div>

            {/* Album Cover */}
            <img
                src={track.album?.images?.[0]?.url || '/placeholder-album.png'}
                alt={track.album?.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-md"
            />

            {/* Track Info */}
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

            {/* Duration */}
            <div className="text-sm text-text-subdued">
                {millisecondsToTime(track.duration_ms)}
            </div>

            {/* Menu Button */}
            <div className="relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-background-elevated-press rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    title="More options"
                >
                    <FaEllipsisH className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                    <>
                        <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-1 bg-background-elevated-highlight rounded-lg shadow-lg border border-background-elevated-press py-1 min-w-[180px] z-20">
                            <button
                                onClick={() => {
                                    onToggleFavorite(track);
                                    setShowMenu(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-background-elevated-press transition-colors duration-200 flex items-center gap-2"
                            >
                                {isFavorite(track.id) ? (
                                    <>
                                        <FaHeart className="w-4 h-4 text-essential-bright-accent" />
                                        <span>Remove from favorites</span>
                                    </>
                                ) : (
                                    <>
                                        <FaRegHeart className="w-4 h-4" />
                                        <span>Add to favorites</span>
                                    </>
                                )}
                            </button>
                            
                            <a
                                href={track.external_urls?.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-4 py-2 text-left text-sm hover:bg-background-elevated-press transition-colors duration-200 flex items-center gap-2"
                                onClick={() => setShowMenu(false)}
                            >
                                <RedirectIcon className="w-4 h-4" />
                                <span>Open in Spotify</span>
                            </a>

                            <button
                                onClick={() => {
                                    onRemove(track.id);
                                    setShowMenu(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-background-elevated-press transition-colors duration-200 flex items-center gap-2"
                            >
                                <FaTrash className="w-4 h-4" />
                                <span>Remove from playlist</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function PlaylistDisplay({ playlist, onRemoveTrack, onRefresh, onAddMore, onSaveToSpotify, onReorder }) {
    const [favorites, setFavorites] = useState([]);
    const [isClient, setIsClient] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const storedFavorites = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
            setFavorites(storedFavorites);
        }
    }, []);

    const toggleFavorite = async (track) => {
        if (typeof window === 'undefined') return;
        
        const isFav = favorites.find(f => f.id === track.id);
        let updatedFavorites;

        if (isFav) {
            // Eliminar de favoritos
            updatedFavorites = favorites.filter(f => f.id !== track.id);
            // Eliminar de Spotify liked songs
            try {
                await removeTrackForUser(track.id);
            } catch (error) {
                console.error('Error removing from Spotify:', error);
            }
        } else {
            // Añadir a favoritos
            updatedFavorites = [...favorites, track];
            // Guardar en Spotify liked songs
            try {
                await saveTrackForUser(track.id);
            } catch (error) {
                console.error('Error saving to Spotify:', error);
            }
        }

        setFavorites(updatedFavorites);
        localStorage.setItem('favorite_tracks', JSON.stringify(updatedFavorites));
    };

    const isFavorite = (trackId) => {
        if (!isClient) return false;
        return favorites.some(f => f.id === trackId);
    };

    const millisecondsToTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = playlist.findIndex((track) => track.id === active.id);
            const newIndex = playlist.findIndex((track) => track.id === over.id);

            const newPlaylist = arrayMove(playlist, oldIndex, newIndex);
            onReorder?.(newPlaylist);
        }
    };

    if (!playlist || playlist.length === 0) {
        return (
            <div className="border border-background-elevated-highlight rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-xl font-bold mb-2">No Playlist Generated Yet</h3>
                <p className="text-text-subdued">
                    Select your preferences from the widgets and click "Generate Playlist"
                </p>
            </div>
        );
    }

    return (
        <div className="border border-background-elevated-highlight rounded-lg p-3 sm:p-4">
            {/* Header */}
            <div className="flex flex-col items-start mb-3 sm:mb-4 gap-3">
                <div className="w-full">
                    <h3 className="text-lg sm:text-xl font-bold">Your Mixed Playlist</h3>
                    <p className="text-xs sm:text-sm text-text-subdued">{playlist.length} tracks</p>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                    <button
                        onClick={onRefresh}
                        className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:text-base rounded-full bg-background-elevated-base hover:bg-background-elevated-highlight transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2"
                        title="Refresh playlist"
                    >
                        <FaSync className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate">Refresh</span>
                    </button>
                    <button
                        onClick={onAddMore}
                        className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:text-base rounded-full bg-background-elevated-base hover:bg-background-elevated-highlight transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2"
                        title="Add more tracks"
                    >
                        <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="hidden sm:inline">Add More</span>
                        <span className="sm:hidden truncate">Add</span>
                    </button>
                    {onSaveToSpotify && (
                        <button
                            onClick={onSaveToSpotify}
                            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:text-base rounded-full bg-essential-bright-accent text-background-base hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-1 sm:gap-2 font-bold"
                            title="Save to Spotify"
                        >
                            <FaSpotify className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                            <span className="hidden sm:inline">Save to Spotify</span>
                            <span className="sm:hidden truncate">Save</span>
                        </button>
                    )}
                </div>

                {/* Track List with Drag & Drop */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={playlist.map(track => track.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-1 sm:space-y-2 max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2 w-full">
                            {playlist.map((track, index) => (
                                <SortableTrack
                                    key={track.id}
                                    track={track}
                                    index={index}
                                    isFavorite={isFavorite}
                                    onToggleFavorite={toggleFavorite}
                                    onRemove={onRemoveTrack}
                                    millisecondsToTime={millisecondsToTime}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
