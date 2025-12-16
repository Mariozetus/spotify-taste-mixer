'use client'

import { FaSync, FaPlus, FaSpotify } from 'react-icons/fa';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTrack } from './SortableTrack';
import { useFavorites } from '@/hooks/useFavorites';


export default function PlaylistDisplay({ playlist, onRemoveTrack, onRefresh, onAddMore, onSaveToSpotify, onReorder }) {
    const { isFavorite, toggleFavorite } = useFavorites();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
            <div className="flex flex-col items-start  gap-3">
                <div className="w-full">
                    <h3 className="text-lg sm:text-xl font-bold">Your Mixed Playlist</h3>
                    <p className="text-xs sm:text-sm text-text-subdued">{playlist.length} tracks</p>
                </div>

                <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                    <button
                        onClick={onRefresh}
                        className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:text-base rounded-full bg-background-elevated-base cursor-pointer hover:bg-background-elevated-highlight transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2"
                        title="Refresh playlist"
                    >
                        <FaSync className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate">Refresh</span>
                    </button>
                    <button
                        onClick={onAddMore}
                        className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:text-base rounded-full bg-background-elevated-base cursor-pointer hover:bg-background-elevated-highlight transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2"
                        title="Add more tracks"
                    >
                        <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="hidden sm:inline">Add More</span>
                        <span className="sm:hidden truncate">Add</span>
                    </button>
                    {onSaveToSpotify && (
                        <button
                            onClick={onSaveToSpotify}
                            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:text-base rounded-full bg-essential-bright-accent text-background-base hover:opacity-90 cursor-pointer transition-opacity duration-200 flex items-center justify-center gap-1 sm:gap-2 font-bold"
                            title="Save to Spotify"
                        >
                            <FaSpotify className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                            <span className="hidden sm:inline">Save to Spotify</span>
                            <span className="sm:hidden truncate">Save</span>
                        </button>
                    )}
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={playlist.map(track => track.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-1 sm:space-y-2 max-h-[400px] lg:max-h-[calc(100vh-487px)] overflow-y-auto pr-1 sm:pr-2 w-full">
                            {playlist.map((track, index) => (
                                <SortableTrack
                                    key={track.id}
                                    track={track}
                                    index={index}
                                    isFavorite={isFavorite}
                                    onToggleFavorite={toggleFavorite}
                                    onRemove={onRemoveTrack}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
