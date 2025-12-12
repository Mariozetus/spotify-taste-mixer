import { useState } from "react"

export default function GenreWidget({ onSelect, selectedItems }) {
    const [searchTerm, setSearchTerm] = useState('');
    const MAX_GENRES = 5;
    
    const availableGenres = [ 'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical', 'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal', 'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub', 'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 'forro', 'french', 'funk', 'garage', 'german', 'gospel', 'goth', 'grindcore', 'groove', 'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm', 'indian', 'indie', 'indie-pop', 'industrial', 'iranian', 'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz', 'k-pop', 'kids', 'latin', 'latino', 'malay', 'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno', 'movies', 'mpb', 'new-age', 'new-release', 'opera', 'pagode', 'party', 'philippines-opm', 'piano', 'pop', 'pop-film', 'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock', 'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae', 'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa', 'samba', 'sertanejo', 'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'songwriter', 'soul', 'soundtracks', 'spanish', 'study', 'summer', 'swedish', 'synth-pop', 'tango', 'techno', 'trance', 'trip-hop', 'turkish', 'work-out', 'world-music' ]

    const filteredGenres = availableGenres.filter(genre => 
        genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleGenreClick = (genre) => {
        const isSelected = Array.isArray(selectedItems) && selectedItems.includes(genre);
        if (!isSelected && selectedItems.length >= MAX_GENRES) {
            return; // No permitir añadir más si ya hay 5
        }
        onSelect(genre);
    };

    return(
        <div className="border border-background-elevated-highlight rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold">Select Genres</h3>
                <span className="text-xs sm:text-sm text-text-subdued">
                    {selectedItems.length}/{MAX_GENRES}
                </span>
            </div>
            <input
                type="text"
                placeholder="Filter genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 sm:h-10 pl-3 sm:pl-4 mb-3 sm:mb-4 text-sm sm:text-base rounded-full bg-background-elevated-base hover:bg-background-elevated-highlight transition-colors duration-400 outline-none"
            />
            
            <div className="grid grid-rows-2 gap-2 max-h-32 overflow-y-auto pb-2">
                {[0, 1].map(row => (
                    <div key={row} className="flex flex-nowrap gap-2">
                        {
                            filteredGenres
                                .slice(
                                    Math.ceil(filteredGenres.length / 2) * row,
                                    Math.ceil(filteredGenres.length / 2) * (row + 1)
                                )
                                .map(genre => { 
                                    const isSelected = Array.isArray(selectedItems) && selectedItems.includes(genre);
                                    const isDisabled = !isSelected && selectedItems.length >= MAX_GENRES;
                                    return(
                                        <button 
                                            key={genre}
                                            onClick={() => handleGenreClick(genre)}
                                            disabled={isDisabled}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap duration-200 capitalize shrink-0 ${
                                                isSelected 
                                                    ? 'bg-essential-bright-accent text-background-base' 
                                                    : isDisabled
                                                    ? 'bg-background-elevated-base text-text-subdued opacity-50 cursor-not-allowed'
                                                    : 'bg-background-elevated-base hover:bg-background-elevated-highlight text-text-base'
                                            }`}
                                        >
                                            {genre}
                                        </button>
                                    )
                                })
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}