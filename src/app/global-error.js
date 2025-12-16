'use client'

import { useEffect } from 'react';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error('Global error:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center px-4 bg-background-base text-text-base">
                    <div className="text-center max-w-md">
                        <FaExclamationTriangle className="text-6xl text-essential-negative mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-3">Something went wrong!</h2>
                        <p className="text-text-subdued mb-6 text-sm">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={reset}
                                className="px-6 py-3 rounded-full bg-essential-bright-accent text-background-base hover:opacity-90 transition-opacity duration-200 font-medium"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-3 rounded-full bg-background-elevated-base hover:bg-background-elevated-highlight border border-background-elevated-highlight transition-colors duration-200 font-medium flex items-center gap-2"
                            >
                                <FaHome />
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
