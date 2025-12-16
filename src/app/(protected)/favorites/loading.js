export default function FavoritesLoading() {
    return (
        <div className="min-h-[calc(100vh-4rem)] p-3 sm:p-4 md:p-6">
            <div className="animate-pulse">
                <div className="mb-6">
                    <div className="h-8 bg-background-elevated-highlight rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-background-elevated-highlight rounded w-1/4"></div>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="h-10 bg-background-elevated-highlight rounded w-32"></div>
                    <div className="h-10 bg-background-elevated-highlight rounded w-32"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="h-64 bg-background-elevated-highlight rounded-lg"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
