import axios, { all } from "axios";
import { getAccessToken, getValidAccessToken, logout } from "./auth";

const SPOTIFY_API = 'https://api.spotify.com/v1';

// ahora en vez de usar por ejemplo axios.get() 
// podemos usr spotifyApi.get()
export const spotifyApi = axios.create({
    baseURL: SPOTIFY_API
});

// Se ejecuta antes de cada peticion de spotifyApi, para asi evitar tener
// que hacer coasas repetitivas como añadir el header
spotifyApi.interceptors.request.use(async (config) => {
    // Intentar obtener un token válido (refresca si es necesario)
    const token = await getValidAccessToken();
    
    if (!token) {
        // Cancelar peticion
        return Promise.reject(new axios.Cancel('No valid token available'));
    }
    
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Interceptor de respuesta para manejar errores de autenticación
// vericar que seguimos conectados o tenemos permisos
spotifyApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            logout();
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

// Obtener artista por id
export const getArtist = (id) => {
    spotifyApi.get('artists', {
        params: { id }
    })
}

// Canciones mas escuchadas del usuario
export const getTopTracks = (timeRange = 'medium_term', limit = 20) => 
    spotifyApi.get('/me/top/tracks', { 
        params: { time_range: timeRange, limit } 
    });

// Artistas mas escuchados del usuario
export const getTopArtists = (timeRange = 'medium_term', limit = 20) => 
    spotifyApi.get('/me/top/artists', { 
        params: { time_range: timeRange, limit } 
    });

// Buscar artistas
export const searchArtists = (query, limit = 10) => 
    spotifyApi.get('/search', {
        params: { q: query, type: 'artist', limit }
    });

// Buscar canciones
export const searchTracks = (query, limit = 20, offset = 0) => 
    spotifyApi.get('/search', {
        params: { q: query, type: 'track', limit, offset }
    });


// Obtener información del usuario actual
export const getCurrentUser = () => 
    spotifyApi.get('/me');

// Crear una playlist en Spotify
export const createPlaylist = (userId, name, description, visibility = false) => 
    spotifyApi.post(`/users/${userId}/playlists`, {
        name,
        description,
        public: visibility
    });

// Añadir canciones a una playlist
export const addTracksToPlaylist = (playlistId, trackUris) => 
    spotifyApi.post(`/playlists/${playlistId}/tracks`, {
        uris: trackUris
    });

// Subir imagen de portada de playlist 
// Requisitos: Base64 encoded JPEG image data, maximum payload size is 256 KB.
export const uploadPlaylistCover = (playlistId, base64Image) =>
    spotifyApi.put(`/playlists/${playlistId}/images`, base64Image, {
        headers: {
            'Content-Type': 'image/jpeg'
        }
    });

// Obtener top canciones de un artista
export const getArtistTopTracks = (artistId, market = 'US') =>
    spotifyApi.get(`/artists/${artistId}/top-tracks`, {
        params: { market }
    });

// Obtener las canciones con "me gusta" del usuario
export const getUserSavedTracks = async (limit = 50, offset = 0) => {
    if (limit <= 50) {
        return spotifyApi.get('/me/tracks', {
            params: { limit, offset }
        });
    }
    
    let allTracks = [];
    let currentOffset = offset;
    let hasMore = true;
    
    // loop para coger varias paginas
    while (hasMore) {
        const response = await spotifyApi.get('/me/tracks', {
            params: { limit: 50, offset: currentOffset }
        });
        
        const items = response.data.items;
        allTracks = allTracks.concat(items);
        
        // Comprobar si quedan mas paginas o ya se llego al numero
        // deseado
        if (items.length < 50 || allTracks.length >= limit) {
            hasMore = false;
        } else {
            currentOffset += 50;
        }
    }
    
    return { data: { items: allTracks.slice(0, limit) } };
};

// Guardar cancion en canciones "me gusta" del usuario
export const saveTrackForUser = (trackId) =>
    spotifyApi.put('/me/tracks', null, {
        params: { ids: trackId }
    });

// Eliminar cancion de canciones "me gusta" del usuario
export const removeTrackForUser = (trackId) =>
    spotifyApi.delete('/me/tracks', {
        params: { ids: trackId }
    });

// Verificar si la cancion está en me gusta
export const checkUserSavedTracks = (trackIds) =>
    spotifyApi.get('/me/tracks/contains', {
        params: { ids: trackIds.join(',') }
    });

// Genera una playlist (no la sube) segun preferencias pasadas
export async function generatePlaylist(preferences, numSongs = 50, includeFavorites = false) {
    
    const { artists, genres, decades, popularity, mood, tracks } = preferences;
    
    let allTracks = [];

    try {
        // 1. Obtener canciones de los artistas seleccionados
        const hasArtistsSelected = artists && artists.length > 0;
        if (hasArtistsSelected) {
            
            // Cogemos el triple, para obtener el numero mas cercano al pedido tras pasar todos los filtros
            const targetTracks = numSongs * 3; 
            
            const hasPopularitySelected = popularity;
            
            // Si se ha seleccionado canciones mainstream asegurar tener
            // de primeras
            if(hasPopularitySelected && popularity >= 75){
                for (const artist of artists) {
                    const response = await getArtistTopTracks(artist.id);
                    
                    allTracks.push(...response.data.tracks);
                }
            }
            
            
            // Si necesitamos más canciones, añadimos mas en un loop, no lo hacemos
            // de una por el limite de la API de spoty
            while (allTracks.length < targetTracks) {
                const tracksNeeded = targetTracks - allTracks.length;
                // Para que haya la misma cantidad de cada uno
                const tracksPerArtist = Math.ceil(tracksNeeded / artists.length); 
                
                for (const artist of artists) {
                    try {
                        // Buscar mas canciones del artista
                        const response = await searchTracks(`artist:"${artist.name}"`, tracksPerArtist);
                        if (response.data.tracks && response.data.tracks.items) {
                            // Filtrar para asegurar que son del artista correcto
                            const artistTracks = response.data.tracks.items.filter(track =>
                                track.artists.some(a => a.id === artist.id)
                            );
                            
                            allTracks.push(...artistTracks);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    
                    // Si ya tenemos suficientes, parar
                    if (allTracks.length >= targetTracks) break;
                }
                
            }
        }
        // Solo buscar camciones aleatorias si NO hay artistas seleccionados
        else {
            const targetTracks = numSongs * 3;
            const tracksNeeded = targetTracks - allTracks.length;
            
            // Calcular cuántas búsquedas necesitamos (50 tracks por búsqueda)
            const numQueries = Math.ceil(tracksNeeded / 50);
            
            const randomQueries = [];
            const minYear = 1950;
            const maxYear = new Date.getFullYear();

            // Crear queries con rangos de epocas totalmente aleatorios (entre 1960 y 2025)
            for (let i = 0; i < numQueries; i++) {
                const start = minYear + Math.floor(Math.random() * (maxYear - minYear - 1));
                const end = start + Math.floor(Math.random() * (maxYear - start));

                randomQueries.push({
                    query: `year:${start}-${end}`,
                    limit: 50,
                    offset: Math.floor(Math.random() * 500),
                });
            }
            
            // Usamos las queries
            for (const { query, limit, offset } of randomQueries) {
                try {
                    const response = await searchTracks(query, limit, offset);
                    if (response.data.tracks && response.data.tracks.items) {
                        
                        allTracks.push(...response.data.tracks.items);
                    }
                } catch (error) {
                    console.log(`Error with query "${query}":`, error);
                }
                
                // Si ya tenemos suficientes, parar
                if (allTracks.length >= targetTracks) break;
            }
            
        }
        
        // 2. Si se incluyen favoritos, cargarlos ahora, para que se le aplique los filtros
        if (includeFavorites && typeof window !== 'undefined') {
            const favorites = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
            
            allTracks.push(...favorites);
        }

        
        // 3. Filtrar canciones por géneros y por mood (realmente es por generso asociados a ese mood segun mi
        //  consideracion ya que esta deprecado las audio features)
        if (((genres && genres.length > 0) ||  (mood && mood.genres))&& allTracks.length > 0) {
            // Añadimos como dato el genero a las cacnioens
            allTracks = await addGenresToTracks(allTracks);
            
            if(genres && genres.length > 0){
                // Verificar que coincida con alguno de los generos de preferencias
                allTracks = allTracks.filter(track => {
                    const matchGenre = track.allGenres && track.allGenres.some(g => genres.includes(g));
                    return matchGenre;
                })    
            }
            else if(mood && mood.genres){
                allTracks = allTracks.filter(track => {
                    const matchMood = track.allGenres && track.allGenres.some(g => mood.genres.includes(g));
                    return matchMood;
                })
            }
        }
        

        // 4. Filtrar por popularidad
        if (popularity) {
            allTracks = allTracks.filter(
                track => track.popularity >= popularity.min && track.popularity <= popularity.max
            );
            
        }

        // 5. Filtrar por década
        if (decades && decades.length > 0) {
            allTracks = allTracks.filter(track => {
                if (!track.album?.release_date) return false;
                const year = new Date(track.album.release_date).getFullYear();
                return decades.some(decade => {
                    const decadeStart = parseInt(decade.replace('s', ''));
                    return year >= decadeStart && year < decadeStart + 10;
                });
            });
            
        }
        
        // 6. Añadir las canciones elegidas por el usuario despues
        // de los filtros pq tienen que estar si o si

        let selectedTracks = [];        

        if (tracks && tracks.length > 0) {
            
            selectedTracks = tracks;
        }
        
        // Eliminar duplicados de la playlist generada hasta ahora
        const uniqueTracks = Array.from(
            new Map(allTracks.map(track => [track.id, track])).values()
        );
        

        // Mezclar aleatoriamente y coger solo las que necesitamos para llegar a el objetivo
        const shuffled = uniqueTracks.sort(() => Math.random() - 0.5);
        let finalPlaylist = shuffled.slice(0, Math.max(numSongs - selectedTracks.length, 0));       
        
        // Ahora juntamos la playlist con la seleccionada
        finalPlaylist.push(...selectedTracks);

        // Eliminamos duplicadas por si coinciden
        finalPlaylist = Array.from(
            new Map(finalPlaylist.map(track => [track.id, track])).values()
        );

        // Mezcla final
        finalPlaylist = finalPlaylist.sort(() => Math.random() - 0.5);

        return finalPlaylist;

    } 
    catch (error) {
        console.error('Error generating playlist:', error);
        throw error;
    }
}

// Sube y configura la playlist a Spotify (NO GENERA LAS CANCIONES)
export async function savePlaylistToSpotify(tracks, playlistName = 'My Taste Mix', description = 'Created with Spotify Taste Mixer', coverImage = null) {
    try {
        const userResponse = await getCurrentUser();
        const userId = userResponse.data.id;

        // Subir la playlist a spotify (solo la estructura)
        const playlistResponse = await createPlaylist(
            userId,
            playlistName,
            description
        );
        const playlistId = playlistResponse.data.id;

        // 3Añadimos las canciones a la playlist
        const trackUris = tracks.map(track => `spotify:track:${track.id}`);
        await addTracksToPlaylist(playlistId, trackUris);

        // Cambiamos la portada si se aha seleccionado una
        if (coverImage) {
            await uploadPlaylistCover(playlistId, coverImage);
        }

        return {
            success: true,
            playlistId,
            playlistUrl: playlistResponse.data.external_urls.spotify
        };
    } 
    catch (error) {
        console.error('Error saving playlist to Spotify:', error);
        throw error;
    }
}

// Funcion auxiliar que añade a las canciones los generos
// de sus artistas (no es preciso ni rapido pero es lo mejor que se me ocurrio :) )
async function addGenresToTracks(tracks) {
    if (!tracks || tracks.length === 0) return [];
    
    // Obtener IDs, flatMap devuelve un array con los subArrays recibidos
    const artistIds = tracks.flatMap(track => 
        track.artists ? track.artists.map(artist => artist.id) : []
    );
        
    const artistGenres = new Map();
    
    for (let i = 0; i < artistIds.length; i ++) {
        
        try {
            const response = await getArtist(artistIds[i]);
        
            if(response?.data?.genres){
                // Guardar géneros con id de artista
                artistGenres.set(response.data.id, response.data.genres || []);
            };        
        } catch (error) {
            console.error(error);
        }
    }
    
    return tracks.map(track => ({
        ...track,
        artists: track.artists?.map(artist => ({
            ...artist,
            genres: artistGenres.get(artist.id) || []
        })),
        // Agregar todos los géneros del track para facilitar filtrado
        allGenres: [...new Set(
            track.artists?.flatMap(artist => 
                artistGenres.get(artist.id) || []
            ) || []
        )]
    }));
}