'use client';

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, message, type = 'info' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg className="w-12 h-12 text-essential-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-12 h-12 text-essential-negative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-12 h-12 text-essential-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-12 h-12 text-essential-bright-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200">
            <div className="bg-background-elevated-base border border-background-elevated-highlight rounded-lg shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    {getIcon()}
                    
                    {title && (
                        <h3 className="mt-4 text-xl font-bold text-text-base">
                            {title}
                        </h3>
                    )}
                    
                    <p className="mt-3 text-sm text-text-base whitespace-pre-line">
                        {message}
                    </p>
                    
                    <button
                        onClick={onClose}
                        className="mt-6 w-full px-6 py-3 bg-essential-bright-accent hover:opacity-90 text-background-base font-bold rounded-full transition-opacity duration-200"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
