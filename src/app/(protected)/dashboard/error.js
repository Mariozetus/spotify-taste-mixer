'use client'

import { useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function DashboardError({ error, reset }) {
    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <FaExclamationTriangle className="text-6xl text-essential-negative mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-3">Something went wrong!</h2>
                <p className="text-text-subdued mb-6 text-sm">
                    There was an error loading the dashboard. Please try again.
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
                        className="px-6 py-3 rounded-full bg-background-elevated-base hover:bg-background-elevated-highlight border border-background-elevated-highlight transition-colors duration-200 font-medium"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}
