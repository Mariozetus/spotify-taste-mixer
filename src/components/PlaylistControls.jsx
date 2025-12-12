'use client';

export default function PlaylistControls({
    numSongs,
    onNumSongsChange,
    includeFavorites,
    onIncludeFavoritesChange,
    onGenerate,
    isGenerating
}) {
    return (
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 border border-background-elevated-highlight rounded-lg bg-background-elevated-base sticky top-0 z-10">
            {/* Number of Songs Selector */}
            <div>
                <label className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="font-medium">Number of songs</span>
                    <span className="text-text-subdued">{numSongs}</span>
                </label>
                <div className="relative">
                    <div className="absolute h-2 bg-background-elevated-highlight rounded-lg w-full"></div>
                    <div 
                        className="absolute h-2 bg-essential-bright-accent rounded-lg transition-all duration-50"
                        style={{ width: `${((numSongs - 10) / (200 - 10)) * 100}%` }}
                    ></div>
                    <input
                        type="range"
                        min="10"
                        max="200"
                        step="10"
                        value={numSongs}
                        onChange={(e) => onNumSongsChange(parseInt(e.target.value))}
                        className="relative -top-2.5 w-full h-2 cursor-pointer appearance-none bg-transparent"
                        style={{
                            WebkitAppearance: 'none',
                        }}
                    />
                </div>
                <div className="flex justify-between text-xs text-text-subdued mt-1">
                    <span>10</span>
                    <span>200</span>
                </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={includeFavorites}
                    onChange={(e) => onIncludeFavoritesChange(e.target.checked)}
                    className="appearance-none w-5 h-5 border-2 border-text-subdued rounded checked:bg-essential-bright-accent checked:border-essential-bright-accent transition-all duration-200 cursor-pointer relative
                    before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzIDRMNiAxMUwzIDgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==')] before:bg-center before:bg-no-repeat before:opacity-0 checked:before:opacity-100"
                />
                <span className="text-sm font-normal text-text-subdued group-hover:text-text-base transition-colors duration-200">
                    Include favorite songs
                </span>
            </label>
            <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 font-bold text-sm sm:text-base rounded-full bg-essential-bright-accent text-background-base hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? 'Generating...' : 'Generate Playlist'}
            </button>
        </div>
    );
}
