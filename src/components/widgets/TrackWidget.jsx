
import { searchTracks, getTopTracks } from "@/lib/spotify"
import { useState, useEffect } from "react"
import { SearchRounded as SearchIcon } from "../icons/SearchIcon";
import TrackCard from "../TrackCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useDebounce } from "@/hooks/useDebounce";


export default function TrackWidget({ onSelect, selectedItems, artists, onReset }){
    
    const [tracks, setTracks] = useState([]);
    const [filterByArtists, setFilterByArtists] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [topTracks, setTopTracks] = useState([]);
    const {isFavorite, toggleFavorite} = useFavorites();
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    
    useEffect(() => {
        // Cargar top tracks al inicio
        const loadTopTracks = async () => {
            try {
                const response = await getTopTracks('short_term', 10);
                const items = response.data.items;
                
                // Si no tiene top tracks, buscar tracks populares
                if (!items || items.length === 0) {
                    const fallback = await searchTracks('year:2025');
                    const popularTracks = fallback.data.tracks.items;
                    setTopTracks(popularTracks);
                    if (!searchTerm) {
                        setTracks(popularTracks);
                    }
                } else {
                    setTopTracks(items);
                    if (!searchTerm) {
                        setTracks(items);
                    }
                }
            } catch (error) {
                console.error('Error loading top tracks:', error);
                // En caso de error, intentar buscar tracks populares
                try {
                    const fallback = await searchTracks('year:2025');
                    const popularTracks = fallback.data.tracks.items;
                    setTopTracks(popularTracks);
                    setTracks(popularTracks);
                } catch (e) {
                    console.error('Error loading fallback tracks:', e);
                }
            }
        };
        loadTopTracks();
    }, []);

    useEffect(() => {
        if (!debouncedSearchTerm) {
            setTracks(topTracks);
            setIsLoading(false);
            return;
        }

        const searchTracksAsync = async () => {
            setIsLoading(true);
            try {
                const response = await searchTracks(debouncedSearchTerm);
                const data = response.data.tracks.items;
                
                if (filterByArtists) {
                    const filtered = filterTracksByArtists(data, artists);
                    setTracks(filtered);
                } else {
                    setTracks(data);
                }
            } catch (error) {
                console.error('Error searching tracks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        searchTracksAsync();
    }, [debouncedSearchTerm, filterByArtists, artists, topTracks]);

    const filterTracksByArtists = (tracks, artists) => {
        
        if (!Array.isArray(tracks) || !Array.isArray(artists)) {
            return [];
        }
        
        const artistIds = artists.map(a => a.id);
        
        const filtered = tracks.filter((track) => {
            const trackArtistIds = track?.artists?.map(a => a.id) || [];
            const match = trackArtistIds.some(id => artistIds.includes(id));
            
            return match;
        });
        
        return filtered;
    }

    const millisecondsToTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes} : ${seconds.toString().padStart(2, '0')}`;
    }

    return(
        <div className="border border-background-elevated-highlight rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 mb-3 sm:mb-4">
                <div className="flex items-center h-9 sm:h-10 w-full sm:w-60 px-3 rounded-full bg-background-elevated-base hover:bg-background-elevated-highlight transition-colors duration-400 ">
                    <SearchIcon className="font-bold mr-2 h-full"/>
                    <input
                        className="w-full outline-none font-medium text-sm sm:text-base bg-transparent"
                        autoComplete="off"
                        placeholder="Search track..."
                        onChange={(e) => setSearchTerm(e.target.value)}>
                    </input>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-1 sm:flex-initial">
                        <input
                            type="checkbox"
                            checked={filterByArtists}
                            onChange={() => setFilterByArtists(prev => !prev)}
                            className="appearance-none w-4 h-4 sm:w-5 ml-1 sm:h-5 border-2 border-text-subdued rounded checked:bg-essential-bright-accent checked:border-essential-bright-accent transition-all duration-200 cursor-pointer relative
                            before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzIDRMNiAxMUwzIDgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==')] before:bg-center before:bg-no-repeat before:opacity-0 checked:before:opacity-100"
                        />
                        <span className="text-xs sm:text-sm font-normal text-text-subdued group-hover:text-text-base transition-colors duration-200">
                            Filter by selected artists
                        </span>
                    </label>
                    {selectedItems && selectedItems.length > 0 && (
                        <button
                            onClick={onReset}
                            className="px-3 sm:px-4 py-2 h-9 sm:h-10 rounded-full bg-background-elevated-base hover:bg-background-elevated-highlight transition-colors duration-200 text-xs sm:text-sm font-medium whitespace-nowrap"
                            title="Clear selection"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 gap-1 max-h-[400px] sm:max-h-[500px]">
                    {Array.from({ length: Math.floor(500 / 84) }).map((_, idx) => (
                        <div key={idx} className="flex items-center rounded-lg px-2 sm:px-4 gap-2 sm:gap-4 py-2 h-16 sm:h-20 animate-pulse">
                            <div className="h-12 sm:h-full aspect-square rounded-md bg-background-elevated-highlight"></div>
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="h-4 bg-background-elevated-highlight rounded w-3/4"></div>
                                <div className="h-3 bg-background-elevated-highlight rounded w-1/2"></div>
                            </div>
                            <div className="h-3 bg-background-elevated-highlight rounded w-12"></div>
                            <div className="size-3 sm:size-4 bg-background-elevated-highlight rounded"></div>
                        </div>
                    ))}
                </div>
            )}

            {
                !isLoading && (tracks != undefined && tracks.length !== 0) &&
                    <div className="grid grid-cols-1 gap-1 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2">
                    {
                        tracks.map(track => {
                            const isSelected = Array.isArray(selectedItems) && selectedItems.some(item => item?.id === track?.id);
                            return (
                                <TrackCard 
                                    key={track?.id}
                                    track={track}
                                    isSelected={isSelected}
                                    onClick={onSelect}
                                    isFavorite={isFavorite}
                                    onToggleFavorite={toggleFavorite}
                                />
                            );
                        })
                    }
                    </div>
            }
        </div>
    )
}