export default function DashboardLoading() {
    return (
        <div className="min-h-[calc(100vh-4rem)] px-3 sm:px-4 md:px-6">
            <div className="h-full flex flex-col lg:flex-row gap-4 md:gap-6">
                <div className="flex-1 p-1 sm:p-2">
                    <div className="flex flex-col gap-4 md:gap-6 pb-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="border border-background-elevated-highlight rounded-lg p-3 sm:p-4 animate-pulse">
                                <div className="h-6 bg-background-elevated-highlight rounded w-1/3 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-10 bg-background-elevated-highlight rounded"></div>
                                    <div className="h-10 bg-background-elevated-highlight rounded"></div>
                                    <div className="h-10 bg-background-elevated-highlight rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:w-[45%] xl:w-[40%] border border-background-elevated-highlight rounded-lg p-3 sm:p-4 animate-pulse">
                    <div className="h-8 bg-background-elevated-highlight rounded w-2/3 mb-4"></div>
                    <div className="space-y-2">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="h-20 bg-background-elevated-highlight rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
