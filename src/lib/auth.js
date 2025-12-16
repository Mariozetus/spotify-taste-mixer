import { localStorageUtils } from '@/hooks/useLocalStorage';

// Generar string aleatorio para el parámetro 'state'
export function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Construir URL de autorización de Spotify
export function getSpotifyAuthUrl(forceReauth = false) {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || '';
    const state = generateRandomString(16);

    // Guardar el state para validación posterior (prevenir CSRF)
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('spotify_auth_state', state);
    }

    const scope = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'user-library-read',
        'user-library-modify',
        'playlist-modify-public',
        'playlist-modify-private',
        'ugc-image-upload'
    ].join(' ');

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        state: state,
        scope: scope,
        // Forzar que Spotify muestre el diálogo de autorización nuevamente
        show_dialog: forceReauth ? 'true' : 'false'
    });
    
    return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Guardar tokens en localStorage
export function saveTokens(accessToken, refreshToken, expiresIn) {
    if (typeof window === 'undefined') return;
    const expirationTime = Date.now() + expiresIn * 1000;
    localStorageUtils.setRaw('spotify_token', accessToken);
    localStorageUtils.setRaw('spotify_refresh_token', refreshToken);
    localStorageUtils.setRaw('spotify_token_expiration', expirationTime.toString());
}

// Obtener token actual (con verificación de expiración)
export function getAccessToken() {
    if (typeof window === 'undefined') return null;
    const token = localStorageUtils.getRaw('spotify_token');
    const expiration = localStorageUtils.getRaw('spotify_token_expiration');

    if (!token || !expiration) return null;

    // Si el token expiró, retornar null
    if (Date.now() > parseInt(expiration)) {
        return null;
    }

    return token;
}

// Obtener refresh token
export function getRefreshToken() {
    if (typeof window === 'undefined') return null;
    return localStorageUtils.getRaw('spotify_refresh_token');
}

// Verificar si el token está próximo a expirar (menos de 5 minutos)
export function isTokenExpiringSoon() {
    if (typeof window === 'undefined') return false;
    const expiration = localStorageUtils.getRaw('spotify_token_expiration');
    if (!expiration) return false;
    
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() > (parseInt(expiration) - fiveMinutes);
}

// Refrescar el token
export async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        // Si no hay refresh token, simplemente retornar null sin hacer logout
        // (el usuario podría nunca haber estado logueado)
        return null;
    }

    try {
        const response = await fetch('/api/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            // Solo hacer logout si el refresh falló (token inválido)
            logout();
            return null;
        }

        const data = await response.json();
        
        // Guardar el nuevo token
        const expirationTime = Date.now() + data.expires_in * 1000;
        localStorageUtils.setRaw('spotify_token', data.access_token);
        localStorageUtils.setRaw('spotify_token_expiration', expirationTime.toString());
        
        return data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        // Solo hacer logout si estábamos autenticados
        if (getAccessToken()) {
            logout();
        }
        return null;
    }
}

// Obtener token válido (refresca si es necesario)
export async function getValidAccessToken() {
    // Si el token es válido y no está próximo a expirar, devolverlo
    const token = getAccessToken();
    if (token && !isTokenExpiringSoon()) {
        return token;
    }
    
    // Intentar refrescar el token
    return await refreshAccessToken();
}

// Verificar si hay token válido
export function isAuthenticated() {
    return getAccessToken() !== null;
}

// Cerrar sesión
export function logout() {
    if (typeof window === 'undefined') return;
    
    // Limpiar tokens de autenticación
    localStorageUtils.removeItem('spotify_token');
    localStorageUtils.removeItem('spotify_refresh_token');
    localStorageUtils.removeItem('spotify_token_expiration');
    
    // Limpiar datos de usuario y preferencias
    localStorageUtils.removeItem('spotify_user');
    localStorageUtils.removeItem('favorite_tracks');
    localStorageUtils.removeItem('dashboard_presets');
    localStorageUtils.removeItem('current_playlist');
    localStorageUtils.removeItem('playlist_history');
    localStorageUtils.removeItem('saved_playlists');
    
    // Limpiar sessionStorage también
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
    }
    
    // Limpiar todas las cookies del dominio
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Marcar que necesitamos forzar reautenticación
    sessionStorage.setItem('force_reauth', 'true');
}