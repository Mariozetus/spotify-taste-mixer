'use client'

import { useState, useEffect } from "react"

export default function MoodWidget({ onSelect, selectedItems }) {
    const moods = [
        { 
            name: 'Happy', 
            genres: ['pop', 'happy', 'summer', 'party', 'dance'],
        },
        { 
            name: 'Sad', 
            genres: ['sad', 'blues', 'melancholy', 'rainy-day', 'emo'],
        },
        { 
            name: 'Energetic', 
            genres: ['workout', 'power', 'edm', 'electronic', 'gym'],
        },
        { 
            name: 'Calm', 
            genres: ['chill', 'ambient', 'study', 'sleep', 'acoustic'],
        },
        { 
            name: 'Party', 
            genres: ['party', 'dance', 'club', 'disco', 'groove'],
        },
        { 
            name: 'Focus', 
            genres: ['focus', 'study', 'concentration', 'work', 'instrumental'],
        }
    ];

    const [selectedMood, setSelectedMood] = useState(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isEnabled && selectedMood) {
            const mood = moods.find(m => m.name === selectedMood);
            onSelect(mood);
        } else {
            onSelect(null);
        }
    }, [selectedMood, isEnabled]);

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood.name);
    };

    if (!mounted) {
        return (
            <div className="border border-background-elevated-highlight rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-bold">Select Mood</h3>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={false}
                            readOnly
                            className="appearance-none w-4 h-4 sm:w-5 sm:h-5 border-2 border-text-subdued rounded checked:bg-essential-bright-accent checked:border-essential-bright-accent transition-all duration-200 cursor-pointer relative
                            before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzIDRMNiAxMUwzIDgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==')] before:bg-center before:bg-no-repeat before:opacity-0 checked:before:opacity-100"
                        />
                        <span className="text-xs sm:text-sm font-normal text-text-subdued group-hover:text-text-base transition-colors duration-200">
                            Enable
                        </span>
                    </label>
                </div>
                <div className="opacity-40 pointer-events-none">
                    <div className="grid grid-cols-2 gap-y-3 sm:gap-y-6 gap-x-2 sm:gap-x-4">
                        {moods.map((mood) => (
                            <button
                                key={mood.name}
                                disabled
                                className="px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-medium bg-background-elevated-base"
                            >
                                <span className="text-base sm:text-lg">{mood.icon}</span>
                                <span>{mood.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-background-elevated-highlight rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold">Select Mood</h3>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => setIsEnabled(e.target.checked)}
                        className="appearance-none w-4 h-4 sm:w-5 sm:h-5 border-2 border-text-subdued rounded checked:bg-essential-bright-accent checked:border-essential-bright-accent transition-all duration-200 cursor-pointer relative
                        before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzIDRMNiAxMUwzIDgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==')] before:bg-center before:bg-no-repeat before:opacity-0 checked:before:opacity-100"
                    />
                    <span className="text-xs sm:text-sm font-normal text-text-subdued group-hover:text-text-base transition-colors duration-200">
                        Enable
                    </span>
                </label>
            </div>
            
            {/* Moods predefinidos */}
            <div className={`transition-opacity duration-200 ${!isEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-2 gap-y-3 sm:gap-y-6 gap-x-2 sm:gap-x-4">
                    {moods.map((mood) => (
                        <button
                            key={mood.name}
                            onClick={() => handleMoodSelect(mood)}
                            disabled={!isEnabled}
                            className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-medium transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2 ${
                                selectedMood === mood.name
                                    ? 'bg-essential-bright-accent text-background-base'
                                    : 'bg-background-elevated-base hover:bg-background-elevated-highlight'
                            }`}
                        >
                            <span className="text-base sm:text-lg">{mood.icon}</span>
                            <span>{mood.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
