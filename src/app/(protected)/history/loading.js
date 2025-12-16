export default function HistoryLoading() {
    return (
        <div className="min-h-[calc(100vh-4rem)] p-3 sm:p-4 md:p-6">
            <div className="animate-pulse">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="h-8 bg-background-elevated-highlight rounded w-48 mb-2"></div>
                        <div className="h-4 bg-background-elevated-highlight rounded w-32"></div>
                    </div>
                    <div className="h-10 bg-background-elevated-highlight rounded w-24"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="border border-background-elevated-highlight rounded-lg p-4">
                                <div className="h-6 bg-background-elevated-highlight rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-background-elevated-highlight rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>

                    {/* Right column - details */}
                    <div className="border border-background-elevated-highlight rounded-lg p-4">
                        <div className="h-8 bg-background-elevated-highlight rounded w-2/3 mb-4"></div>
                        <div className="space-y-2">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <div key={idx} className="h-16 bg-background-elevated-highlight rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
