import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    
    // Obtener tokens de las cookies (solo almacenamos los token)
    const accessToken = request.cookies.get('spotify_access_token')?.value;
    const refreshToken = request.cookies.get('spotify_refresh_token')?.value;
    
    const isAuthenticated = !!(accessToken || refreshToken);
    
    // Rutas protegidas requieren autenticación
    if (pathname.startsWith('/dashboard') || 
        pathname.startsWith('/favorites') || 
        pathname.startsWith('/history')) {
        
        if (!isAuthenticated) {
            const url = request.nextUrl.clone();
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
    }
    
    return NextResponse.next();
}

// Configurar qué rutas ejecutan el middleware
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
