import { useClickOutside } from "@/hooks/useClickOutside";
import { useState } from "react";
import { FaEllipsisH, FaHeart, FaRegHeart } from "react-icons/fa";
import { FaArrowUpRightFromSquare as RedirectIcon } from "react-icons/fa6";

export default function TrackCard({ track, isSelected, onClick, isFavorite, onToggleFavorite }) {
    
    const [showMenu, setShowMenu] = useState(false);
    const dropdownRef = useClickOutside(() => setShowMenu(false));

    const millisecondsToTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} : ${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div 
            key={track?.id}
            onClick={() => onClick(track)}
            className={`flex group items-center rounded-lg px-2 sm:px-4 gap-2 sm:gap-4 py-2 h-16 sm:h-20 text-nowrap hover:text-text-base ${isSelected ? 'bg-background-tinted-press' : 'hover:bg-background-tinted-highlight'} transition-colors duration-200 cursor-pointer relative ${showMenu ? 'z-30' : 'z-0 hover:z-10'}`}>
            <img 
                className="h-12 sm:h-full aspect-square rounded-md bg-background-highlight"
                src={track?.album?.images?.[0]?.url || "default-user.svg"}
            />
            <div className="flex flex-col justify-start items-start min-w-0 flex-1 gap-1">
                <div className="flex items-center gap-2 max-w-full">
                    <span className="font-semibold text-xs sm:text-base truncate text-left" title={track?.name}>
                        {track?.name}
                    </span>
                    {track?.explicit && (
                        <span className="px-1 py-0.5 text-xs bg-text-subdued text-background-base rounded shrink-0">
                            E
                        </span>
                    )}
                </div>
                <div className="truncate max-w-full text-xs" title={track?.artists.map(a => a.name).join(', ')}>
                {
                    track?.artists.map((artist, idx) => {
                        const isLast = idx === track.artists.length - 1;
                        return (
                            <span className={`font-normal text-xs text-left group-hover:text-text-base ${isSelected ? 'text-text-base' : 'text-text-subdued'}`} key={artist?.id}>
                                {artist?.name}{!isLast && ', '}
                            </span>
                        );
                    })
                }
                </div>
            </div>
            <span className="hidden xl:block font-normal text-xs sm:text-sm ml-auto text-text-subdued shrink-0">{millisecondsToTime(track?.duration_ms)}</span>
            <div className="relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowMenu(!showMenu);
                    }}
                    className="p-2 hover:bg-background-elevated-press rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="More options"
                >
                    <FaEllipsisH className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {showMenu && (
                    <div ref={dropdownRef} className="absolute right-0 top-full mt-1 bg-background-elevated-highlight rounded-lg shadow-lg border border-background-elevated-press py-1 min-w-[180px] z-50">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
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
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(false);
                            }}
                        >
                            <RedirectIcon className="w-4 h-4" />
                            <span>Open in Spotify</span>
                        </a>
                    </div>
                )}
            </div>
            
        </div>
    );
}
