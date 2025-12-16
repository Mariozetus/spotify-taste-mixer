export default function AboutLoading() {
    return (
        <div className="min-h-[calc(100vh-4rem)] p-6">
            <div className="max-w-6xl mx-auto animate-pulse">
                <div className="text-center mb-16">
                    <div className="h-12 bg-background-elevated-highlight rounded w-2/3 mx-auto mb-4"></div>
                    <div className="h-6 bg-background-elevated-highlight rounded w-1/2 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {Array.from({ length: 9 }).map((_, idx) => (
                        <div key={idx} className="h-40 bg-background-elevated-highlight rounded-lg"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
