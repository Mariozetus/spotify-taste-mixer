'use client'

import { useState } from "react"

export default function DecadeWidget({ onSelect, selectedItems }) {
    const decades = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

    const handleToggle = (decade) => {
        if (Array.isArray(selectedItems) && selectedItems.includes(decade)) {
            onSelect(selectedItems.filter(d => d !== decade));
        } else {
            onSelect([...(Array.isArray(selectedItems) ? selectedItems : []), decade]);
        }
    };

    return (
        <div className="border border-background-elevated-highlight rounded-lg p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Select Decades</h3>
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2">
                {decades.map((decade) => (
                    <button
                        key={decade}
                        onClick={() => handleToggle(decade)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap shrink-0 ${
                            Array.isArray(selectedItems) && selectedItems.includes(decade)
                                ? 'bg-essential-bright-accent text-background-base'
                                : 'bg-background-elevated-base hover:bg-background-elevated-highlight'
                        }`}
                    >
                        {decade}
                    </button>
                ))}
            </div>
        </div>
    );
}
