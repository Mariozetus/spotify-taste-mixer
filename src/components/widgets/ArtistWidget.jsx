import { searchArtists, getTopArtists } from "@/lib/spotify"
import { useState, useEffect } from "react"
import { SearchRounded as SearchIcon } from "../icons/SearchIcon";
import { useDebounce } from "@/hooks/useDebounce";


export default function ArtistWidget({ onSelect, selectedItems, onReset }){
    
    const [artists, setArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [topArtists, setTopArtists] = useState([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        const loadTopArtists = async () => {
            try {
                const response = await getTopArtists('short_term', 10);
                const items = response.data.items;
                
                if (!items || items.length === 0) {
                    const fallback = await searchArtists('year:2025');
                    const popularArtists = fallback.data.artists.items;
                    setTopArtists(popularArtists);
                    if (!searchTerm) {
                        setArtists(popularArtists);
                    }
                } else {
                    setTopArtists(items);
                    if (!searchTerm) {
                        setArtists(items);
                    }
                }
            } catch (error) {
                console.error('Error loading top artists:', error);
                try {
                    const fallback = await searchArtists('year:2025');
                    const popularArtists = fallback.data.artists.items;
                    setTopArtists(popularArtists);
                    setArtists(popularArtists);
                } catch (e) {
                    console.error('Error loading fallback artists:', e);
                }
            }
        };
        loadTopArtists();
    }, []);

    useEffect(() => {
        if (!debouncedSearchTerm) {
            setArtists(topArtists);
            setIsLoading(false);
            return;
        }

        const searchArtistsAsync = async () => {
            setIsLoading(true);
            try {
                const response = await searchArtists(debouncedSearchTerm);
                setArtists(response.data.artists.items);
            } catch (error) {
                console.error('Error searching artists:', error);
            } finally {
                setIsLoading(false);
            }
        };

        searchArtistsAsync();
    }, [debouncedSearchTerm, topArtists]);

    return(
        <div className="border border-background-elevated-highlight rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="flex items-center h-9 sm:h-10 w-full sm:w-60 px-3 rounded-full bg-background-elevated-base hover:bg-background-elevated-highlight transition-colors duration-400">
                    <SearchIcon className="font-bold mr-2 h-full"/>
                    <input
                        className="w-full outline-none font-medium text-sm sm:text-base bg-transparent"
                        autoComplete="off"
                        placeholder="Search artist..."
                        onChange={(e) => setSearchTerm(e.target.value)}>
                    </input>
                </div>
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
            
            {isLoading && (
                <div className="grid grid-cols-1 gap-1 max-h-[400px] sm:max-h-[500px]">
                    {Array.from({ length: Math.floor(500 / 84) }).map((_, idx) => (
                        <div key={idx} className="flex items-center rounded-lg px-2 sm:px-4 gap-2 sm:gap-4 py-2 h-16 sm:h-20 animate-pulse">
                            <div className="h-12 sm:h-full aspect-square rounded-full bg-background-elevated-highlight"></div>
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="h-4 bg-background-elevated-highlight rounded w-3/4"></div>
                                <div className="h-3 bg-background-elevated-highlight rounded w-1/2"></div>
                            </div>
                            <div className="size-3 sm:size-4 bg-background-elevated-highlight rounded"></div>
                        </div>
                    ))}
                </div>
            )}
            
            {
                !isLoading && (artists != undefined && artists.length !== 0) && 
                    <div className="grid grid-cols-1 gap-1 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2">
                    {
                        artists.map(artist => {
                            const isSelected = Array.isArray(selectedItems) && selectedItems.some(item => item.id === artist.id);
                            return (
                            <button 
                                key={artist?.id}
                                onClick={() => onSelect(artist)}
                                className={`flex items-center rounded-lg px-2 sm:px-4 gap-2 sm:gap-4 py-2 h-16 sm:h-20 ${isSelected ? 'bg-background-tinted-press' : 'hover:bg-background-tinted-highlight'} transition-colors duration-200 cursor-pointer`}>
                                <img 
                                    className="h-12 sm:h-full aspect-square rounded-full bg-background-highlight"
                                    src={artist?.images?.[0]?.url || "default-user.svg"}
                                />
                                <span className="font-semibold text-sm sm:text-base truncate flex-1 text-left">{artist?.name}</span>
                                <span className="hidden truncate text-right flex-1 xl:block font-normal text-xs sm:text-sm text-text-subdued">{artist?.followers?.total.toLocaleString()} followers</span>
                                <a className="hover:scale-110 size-3 sm:size-4 transition-all duration-200 shrink-0" href={artist?.external_urls?.spotify}
                                    target="_blank" rel="noopener noreferrer"> 
                                    <svg className="fill-text-base" width="16" height="16" viewBox="0 0 16 16">
                                        <path d="M1 2.75A.75.75 0 0 1 1.75 2H7v1.5H2.5v11h10.219V9h1.5v6.25a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75z"></path>
                                        <path d="M15 1v4.993a.75.75 0 1 1-1.5 0V3.56L8.78 8.28a.75.75 0 0 1-1.06-1.06l4.72-4.72h-2.433a.75.75 0 0 1 0-1.5z"></path>
                                    </svg>
                                </a>

                            </button>
                        );
                        })
                    }
                    </div>
            }
        </div>
    )
}