'use client';

export default function EmptyPlaylistState({ hasGenerated }) {
    if (!hasGenerated) return null;
    
    return (
        <div className="border border-background-elevated-highlight rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
            <h3 className="text-lg font-bold mb-2">No tracks found</h3>
            <p className="text-text-subdued text-sm max-w-sm">
                No tracks match your current filters. Try adjusting your preferences, adding more options, or removing some filters.
            </p>
        </div>
    );
}
