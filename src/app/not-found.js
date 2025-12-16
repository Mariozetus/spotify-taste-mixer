'use client'

import Link from 'next/link';
import { FaHome, FaMusic } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

export default function NotFound() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <h1 className="text-9xl font-bold text-essential-bright-accent mb-4">404</h1>                
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                    Page Not Found
                </h2>
                <p className="text-text-subdued mb-8 text-sm sm:text-base">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-full bg-essential-bright-accent text-background-base hover:opacity-90 transition-opacity duration-200 font-medium flex items-center justify-center gap-2"
                    >
                        <FaHome />
                        Go Home
                    </Link>
                    {isAuthenticated && (
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 rounded-full bg-background-elevated-base hover:bg-background-elevated-highlight border border-background-elevated-highlight transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                        >
                            <FaMusic />
                            Dashboard
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
