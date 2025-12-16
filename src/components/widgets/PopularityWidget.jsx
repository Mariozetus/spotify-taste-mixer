'use client'

import { useState, useEffect, useRef } from "react"
import RangeSlider from "@/components/RangeSlider"

export default function PopularityWidget({ onSelect, selectedItems }) {
    const categories = [
        { name: 'Mainstream', range: [80, 100], description: 'Top hits & viral songs' },
        { name: 'Popular', range: [50, 79], description: 'Well-known tracks' },
        { name: 'Underground', range: [0, 49], description: 'Hidden gems' }
    ];

    const isFirstRender = useRef(true);
    const hasInitialized = useRef(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [customRange, setCustomRange] = useState({ min: 0, max: 100 });
    const [useCustom, setUseCustom] = useState(false);

    // Sincronizar con selectedItems cuando cambie (para cargar presets)
    useEffect(() => {
        if (!hasInitialized.current && selectedItems && (selectedItems.min !== 0 || selectedItems.max !== 100)) {
            // Intentar encontrar si coincide con alguna categoría
            const matchingCategory = categories.find(c => 
                c.range[0] === selectedItems.min && c.range[1] === selectedItems.max
            );
            
            if (matchingCategory) {
                setSelectedCategory(matchingCategory.name);
                setUseCustom(false);
            } else {
                setUseCustom(true);
                setSelectedCategory(null);
            }
            setCustomRange({ min: selectedItems.min, max: selectedItems.max });
            hasInitialized.current = true;
        }
    }, [selectedItems]);

    useEffect(() => {
        // No llamar onSelect en el primer render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        
        if (useCustom) {
            onSelect(customRange);
        } else if (selectedCategory) {
            const category = categories.find(c => c.name === selectedCategory);
            onSelect({ min: category.range[0], max: category.range[1] });
        } else {
            onSelect({ min: 0, max: 100 });
        }
    }, [selectedCategory, customRange, useCustom]);

    const handleCategorySelect = (categoryName) => {
        setUseCustom(false);
        const isDeselecting = selectedCategory === categoryName;
        setSelectedCategory(isDeselecting ? null : categoryName);
        
        // Actualizar el slider cuando se selecciona una categoría
        if (!isDeselecting) {
            const category = categories.find(c => c.name === categoryName);
            setCustomRange({ min: category.range[0], max: category.range[1] });
        } else {
            setCustomRange({ min: 0, max: 100 });
        }
    };

    const handleCustomRangeChange = (newRange) => {
        setUseCustom(true);
        setSelectedCategory(null);
        setCustomRange(newRange);
    };


    return (
        <div className="border border-background-elevated-highlight rounded-lg p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Select Popularity</h3>
            
            {/* ========================= CATEGORIES ========================= */}
            <div className="mb-4 sm:mb-6 space-y-2">
                <p className="text-xs sm:text-sm text-text-subdued mb-2">Quick Select:</p>
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => handleCategorySelect(category.name)}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 cursor-pointer text-left ${
                            selectedCategory === category.name
                                ? 'bg-essential-bright-accent text-background-base'
                                : 'bg-background-elevated-base hover:bg-background-elevated-highlight'
                        }`}
                    >
                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">{category.name}</span>
                                    <span className="text-xs sm:text-sm opacity-70">
                                        {category.range[0]}-{category.range[1]}
                                    </span>
                                </div>
                                <p className={`text-xs mt-1 ${
                                    selectedCategory === category.name 
                                        ? 'text-background-base opacity-80' 
                                        : 'text-text-subdued'
                                }`}>
                                    {category.description}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* ========================= CUSTOM RANGE ========================= */}
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-background-elevated-highlight">
                <p className="text-xs sm:text-sm text-text-subdued mb-3 sm:mb-4">Custom Range:</p>
                
                <RangeSlider
                    min={0}
                    max={100}
                    initialMin={customRange.min}
                    initialMax={customRange.max}
                    onChange={handleCustomRangeChange}
                />
            </div>
        </div>
    );
}
