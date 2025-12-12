'use client'

import React, { useState, useEffect } from 'react';

export default function RangeSlider({ min = 0, max = 100, initialMin = 0, initialMax = 100, onChange }) {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  useEffect(() => {
    setMinValue(initialMin);
    setMaxValue(initialMax);
  }, [initialMin, initialMax]);

  const handleMin = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(value);
    onChange?.({ min: value, max: maxValue });
  };

  const handleMax = (e) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(value);
    onChange?.({ min: minValue, max: value });
  };

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="relative h-2 bg-background-elevated-base rounded-full">
          <div
            className="absolute h-2 bg-essential-bright-accent rounded-full transition-all duration-50"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`
            }}
          />
          
          <input
            type="range"
            min={min}
            max={max}
            value={minValue}
            onChange={handleMin}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none 
              [&::-webkit-slider-thumb]:pointer-events-auto 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-essential-bright-accent 
              [&::-webkit-slider-thumb]:cursor-pointer 
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:border-2 
              [&::-webkit-slider-thumb]:border-background-base
              [&::-moz-range-thumb]:pointer-events-auto 
              [&::-moz-range-thumb]:appearance-none 
              [&::-moz-range-thumb]:w-4 
              [&::-moz-range-thumb]:h-4 
              [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-essential-bright-accent 
              [&::-moz-range-thumb]:cursor-pointer 
              [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:border-2 
              [&::-moz-range-thumb]:border-background-base"
          />
          
          <input
            type="range"
            min={min}
            max={max}
            value={maxValue}
            onChange={handleMax}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none 
              [&::-webkit-slider-thumb]:pointer-events-auto 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-essential-bright-accent 
              [&::-webkit-slider-thumb]:cursor-pointer 
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:border-2 
              [&::-webkit-slider-thumb]:border-background-base
              [&::-moz-range-thumb]:pointer-events-auto 
              [&::-moz-range-thumb]:appearance-none 
              [&::-moz-range-thumb]:w-4 
              [&::-moz-range-thumb]:h-4 
              [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-essential-bright-accent 
              [&::-moz-range-thumb]:cursor-pointer 
              [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:border-2 
              [&::-moz-range-thumb]:border-background-base"
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-text-subdued">{minValue}</span>
        <span className="text-text-subdued">{maxValue}</span>
      </div>
    </div>
  );
}