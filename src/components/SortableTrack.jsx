import { FaHeart, FaRegHeart, FaTrash, FaGripVertical, FaEllipsisH } from "react-icons/fa";
import { FaArrowUpRightFromSquare as RedirectIcon} from "react-icons/fa6";
import { useState } from "react";

import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useClickOutside } from "@/hooks/useClickOutside";

export function SortableTrack({ track, index, isFavorite, onToggleFavorite, onRemove }) {

    const [showMenu, setShowMenu] = useState(false);
    const dropdownRef = useClickOutside(() => setShowMenu(false));

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

    const millisecondsToTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} : ${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-background-elevated-base hover:bg-background-elevated-highlight transition-colors duration-200 group"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-text-subdued hover:text-text-base transition-colors touch-manipulation"
            >
                <FaGripVertical className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>

            <div className="w-4 sm:w-6 text-center text-text-subdued text-xs sm:text-sm">
                {index + 1}
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

            <div className="text-sm text-text-subdued">
                {millisecondsToTime(track.duration_ms)}
            </div>

            <div className="relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-background-elevated-press rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="More options"
                >
                    <FaEllipsisH className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {showMenu && (
                    <>
                        <div ref={dropdownRef} className="absolute right-0 top-full mt-1 bg-background-elevated-highlight rounded-lg shadow-lg border border-background-elevated-press py-1 min-w-[180px] z-20">
                            <button
                                onClick={() => {
                                    onToggleFavorite(track);
                                    setShowMenu(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-background-elevated-press transition-colors duration-200 flex items-center gap-2 cursor-pointer"
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
                                className="w-full px-4 py-2 text-left text-sm hover:bg-background-elevated-press transition-colors duration-200 flex items-center gap-2 cursor-pointer"
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