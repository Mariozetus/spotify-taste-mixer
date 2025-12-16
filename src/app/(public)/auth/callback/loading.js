export default function AuthCallbackLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen"> 
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-essential-bright-accent mx-auto mb-4"></div>
                <p className="text-xl">Autenticando...</p>
            </div>
        </div>
    );
}
