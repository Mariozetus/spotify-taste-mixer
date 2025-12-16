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
        // Cancelar peticion silenciosamente (esto es esperado en páginas públicas)
        const error = new axios.Cancel('No valid token available');
        error.__EXPECTED_ERROR__ = true; // Marcar como error esperado
        return Promise.reject(error);
    }
    
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Interceptor de respuesta para manejar errores de autenticación
// vericar que seguimos conectados o tenemos permisos
spotifyApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Si es un error cancelado esperado (sin token), no hacer nada
        if (axios.isCancel(error) && error.__EXPECTED_ERROR__) {
            return Promise.reject(error);
        }
        
        // Solo hacer logout y redirect si hay un error 401 real de la API
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

// Obtener múltiples artistas en una sola llamada (hasta 50)
export const getMultipleArtists = (artistIds) =>
    spotifyApi.get('/artists', {
        params: { ids: artistIds.join(',') }
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

// Genera una playlist (no la sube) según preferencias pasadas
export async function generatePlaylist(preferences, numSongs = 50, includeFavorites = false) {
    console.log('🎵 [generatePlaylist] Iniciando con:', { preferences, numSongs, includeFavorites });
    
    const { artists, genres, decades, popularity, mood, tracks } = preferences;
    
    let allTracks = [];

    try {
        // 1. Obtener canciones de los artistas seleccionados
        const hasArtistsSelected = artists && artists.length > 0;
        if (hasArtistsSelected) {
            
            // Reducir multiplicadores - más realista
            const isUnderground = popularity && popularity.max < 50;
            const targetTracks = isUnderground ? numSongs * 4 : numSongs * 3; 
            
            const hasPopularitySelected = popularity && (popularity.min > 0 || popularity.max < 100);
            
            // Si se ha seleccionado canciones mainstream asegurar tener
            // de primeras (pero NO si es underground)
            if(hasPopularitySelected && popularity.min >= 75 && !isUnderground){
                console.log('🎤 [generatePlaylist] Obteniendo top tracks de artistas populares');
                for (const artist of artists) {
                    const response = await getArtistTopTracks(artist.id);
                    console.log(`   ✓ Top tracks de ${artist.name}:`, response.data.tracks.length);
                    allTracks.push(...response.data.tracks);
                }
            }
            
            // Si necesitamos más canciones, añadimos más en un loop
            console.log(`🔍 [generatePlaylist] Buscando más tracks de artistas. Target: ${targetTracks}, Actuales: ${allTracks.length}`);
            let maxIterations = 3;
            let currentIteration = 0;
            while (allTracks.length < targetTracks && currentIteration < maxIterations) {
                currentIteration++;
                const tracksNeeded = targetTracks - allTracks.length;
                const tracksPerArtist = Math.min(Math.ceil(tracksNeeded / artists.length), 50); 
                
                for (const artist of artists) {
                    try {
                        const response = await searchTracks(artist.name, tracksPerArtist);                        if (response.data.tracks && response.data.tracks.items) {
                            const artistTracks = response.data.tracks.items.filter(track =>
                                track.artists.some(a => a.id === artist.id)
                            );
                            console.log(`   ✓ Encontradas ${artistTracks.length} tracks de ${artist.name}`);
                            allTracks.push(...artistTracks);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    
                    if (allTracks.length >= targetTracks) break;
                }
            }
            if (currentIteration >= maxIterations) {
                console.log(`⚠️ [generatePlaylist] Alcanzado límite de iteraciones (${maxIterations}). Tracks obtenidos: ${allTracks.length}`);
            }
            console.log(`✅ [generatePlaylist] Total tracks obtenidos de artistas: ${allTracks.length}`);
        }
        // Solo buscar canciones aleatorias si NO hay artistas seleccionados
        else {
            // Reducir multiplicador para underground
            const isUnderground = popularity && popularity.max < 50;
            const multiplier = isUnderground ? 5 : 4;
            const targetTracks = numSongs * multiplier;
            const tracksNeeded = targetTracks - allTracks.length;
            
            const tracksPerQuerie = 50;
            // Aumentar número de queries en lugar de usar offsets muy altos
            const numQueries = Math.ceil(tracksNeeded / tracksPerQuerie);
            
            const randomQueries = [];
            
            // Determinar si tenemos géneros o mood seleccionados
            const hasGenres = genres && genres.length > 0;
            const hasMood = mood && mood.genres && mood.genres.length > 0;
            const genresToUse = hasGenres ? genres : (hasMood ? mood.genres : []);
            
            // Si hay géneros, buscar por género directamente
            if (genresToUse.length > 0) {
                console.log(`🎸 [generatePlaylist] Buscando por géneros${isUnderground ? ' (UNDERGROUND)' : ''}: ${genresToUse.join(', ')}`);
                
                for (let i = 0; i < numQueries; i++) {
                    const genre = genresToUse[Math.floor(Math.random() * genresToUse.length)];
                    let query = `genre:"${genre}"`;
                    
                    // Si hay décadas, añadir filtro de año
                    if (decades && decades.length > 0) {
                        const decade = decades[Math.floor(Math.random() * decades.length)];
                        const decadeStart = parseInt(decade.replace('s', ''));
                        const decadeEnd = decadeStart + 9;
                        query += ` year:${decadeStart}-${decadeEnd}`;
                    }
                    
                    // Offsets más razonables - underground usa rango medio-alto
                    const maxOffset = isUnderground ? 400 : 300;
                    const minOffset = isUnderground ? 50 : 0;
                    
                    randomQueries.push({
                        query,
                        limit: tracksPerQuerie,
                        offset: minOffset + Math.floor(Math.random() * (maxOffset - minOffset)),
                    });
                }
            }
            // Si se han seleccionado décadas específicas
            else if (decades && decades.length > 0) {
                console.log(`📅 [generatePlaylist] Generando ${numQueries} queries para las décadas${isUnderground ? ' (UNDERGROUND)' : ''}: ${decades.join(', ')}`);
                
                for (let i = 0; i < numQueries; i++) {
                    const decade = decades[Math.floor(Math.random() * decades.length)];
                    const decadeStart = parseInt(decade.replace('s', ''));
                    const decadeEnd = decadeStart + 9;
                    
                    const maxOffset = isUnderground ? 400 : 400;
                    const minOffset = isUnderground ? 50 : 0;
                    
                    randomQueries.push({
                        query: `year:${decadeStart}-${decadeEnd}`,
                        limit: tracksPerQuerie,
                        offset: minOffset + Math.floor(Math.random() * (maxOffset - minOffset)),
                    });
                }
            } else {
                // Queries completamente aleatorias
                const minYear = 1970;
                const maxYear = (new Date()).getFullYear();
                
                console.log(`🎲 [generatePlaylist] Generando ${numQueries} queries aleatorias`);
                for (let i = 0; i < numQueries; i++) {
                    const start = minYear + Math.floor(Math.random() * (maxYear - minYear - 10));
                    const end = start + Math.floor(Math.random() * Math.min(20, maxYear - start));

                    randomQueries.push({
                        query: `year:${start}-${end}`,
                        limit: tracksPerQuerie,
                        offset: Math.floor(Math.random() * 400),
                    });
                }
            }
            console.log('   Queries generadas:', randomQueries.map(q => q.query).join(', '));
            
            // Ejecutar queries con validación de resultados vacíos
            let emptyResultsCount = 0;
            const maxEmptyResults = 3; // Si 3 queries seguidas devuelven 0, parar
            
            for (const { query, limit, offset } of randomQueries) {
                try {
                    const response = await searchTracks(query, limit, offset);
                    if (response.data.tracks && response.data.tracks.items && response.data.tracks.items.length > 0) {
                        console.log(`   ✓ Query "${query}" devolvió ${response.data.tracks.items.length} tracks`);
                        allTracks.push(...response.data.tracks.items);
                        emptyResultsCount = 0; // Reset contador
                    } else {
                        console.log(`   ⚠️ Query "${query}" devolvió 0 tracks`);
                        emptyResultsCount++;
                        
                        if (emptyResultsCount >= maxEmptyResults) {
                            console.log(`   ⚠️ Detectadas ${maxEmptyResults} queries vacías consecutivas, deteniendo búsqueda`);
                            break;
                        }
                    }
                } catch (error) {
                    console.log(`Error with query "${query}":`, error);
                    emptyResultsCount++;
                }
                
                // Si ya tenemos suficientes, parar
                if (allTracks.length >= targetTracks) {
                    console.log(`   ✓ Target alcanzado (${allTracks.length}/${targetTracks}), deteniendo búsqueda`);
                    break;
                }
            }
            console.log(`✅ [generatePlaylist] Total tracks aleatorios obtenidos: ${allTracks.length}`);
        }
        
        // 2. Si se incluyen favoritos, cargarlos ahora
        if (includeFavorites && typeof window !== 'undefined') {
            const { localStorageUtils } = await import('@/hooks/useLocalStorage');
            const favorites = localStorageUtils.getItem('favorite_tracks', []);
            console.log(`⭐ [generatePlaylist] Incluyendo ${favorites.length} favoritos`);
            allTracks.push(...favorites);
        }
        
        console.log(`📊 [generatePlaylist] Total tracks antes de filtros: ${allTracks.length}`);

        
        // 3. Filtrar canciones por géneros y por mood
        // Necesario si: (a) hay artistas Y (géneros o mood), O (b) NO hay artistas pero sí hay mood
        const needsGenreFiltering = (hasArtistsSelected && ((genres && genres.length > 0) || (mood && mood.genres))) ||
                                     (!hasArtistsSelected && mood && mood.genres && mood.genres.length > 0);
        
        if (needsGenreFiltering && allTracks.length > 0) {
            console.log('🎸 [generatePlaylist] Añadiendo géneros a tracks...');
            allTracks = await addGenresToTracks(allTracks);
            
            if(genres && genres.length > 0){
                const beforeFilter = allTracks.length;
                allTracks = allTracks.filter(track => {
                    const matchGenre = track.allGenres && track.allGenres.some(g => genres.includes(g));
                    return matchGenre;
                })    
                console.log(`   ✓ Filtro de géneros [${genres.join(', ')}]: ${beforeFilter} → ${allTracks.length}`);
            }
            else if(mood && mood.genres){
                const beforeFilter = allTracks.length;
                allTracks = allTracks.filter(track => {
                    const matchMood = track.allGenres && track.allGenres.some(g => mood.genres.includes(g));
                    return matchMood;
                })
                console.log(`   ✓ Filtro de mood [${mood.genres.join(', ')}]: ${beforeFilter} → ${allTracks.length}`);
            }
        }
        

        // 4. Filtrar por popularidad
        if (popularity) {
            const beforeFilter = allTracks.length;
            allTracks = allTracks.filter(
                track => track.popularity >= popularity.min && track.popularity <= popularity.max
            );
            console.log(`🔥 [generatePlaylist] Filtro de popularidad [${popularity.min}-${popularity.max}]: ${beforeFilter} → ${allTracks.length}`);
        }

        // 5. Filtrar por década
        if (decades && decades.length > 0) {
            const beforeFilter = allTracks.length;
            allTracks = allTracks.filter(track => {
                if (!track.album?.release_date) return false;
                const year = new Date(track.album.release_date).getFullYear();
                return decades.some(decade => {
                    const decadeStart = parseInt(decade.replace('s', ''));
                    return year >= decadeStart && year < decadeStart + 10;
                });
            });
            console.log(`📅 [generatePlaylist] Filtro de décadas [${decades.join(', ')}]: ${beforeFilter} → ${allTracks.length}`);
        }
        
        // 6. Añadir las canciones elegidas por el usuario después de los filtros

        let selectedTracks = [];        

        if (tracks && tracks.length > 0) {
            selectedTracks = tracks;
            console.log(`🎯 [generatePlaylist] Tracks seleccionados por usuario: ${selectedTracks.length}`);
        }
        
        // Eliminar duplicados
        const uniqueTracks = Array.from(
            new Map(allTracks.map(track => [track.id, track])).values()
        );
        console.log(`🔄 [generatePlaylist] Tracks únicos después de deduplicación: ${uniqueTracks.length}`);

        // Mezclar y coger las necesarias
        const shuffled = uniqueTracks.sort(() => Math.random() - 0.5);
        const neededFromGenerated = Math.max(numSongs - selectedTracks.length, 0);
        let finalPlaylist = shuffled.slice(0, neededFromGenerated);       
        
        if (finalPlaylist.length < neededFromGenerated) {
            const shortage = neededFromGenerated - finalPlaylist.length;
            console.log(`⚠️ [generatePlaylist] Faltan ${shortage} tracks después de filtros. Obtenidas: ${finalPlaylist.length} de ${neededFromGenerated}`);
            
            // Solo relajar filtros si NO es búsqueda específica underground y hay muy pocas
            const isUnderground = popularity && popularity.max < 50;
            const isVeryNarrowRange = popularity && (popularity.max - popularity.min) < 30;
            
            if (finalPlaylist.length < numSongs / 3 && popularity && isVeryNarrowRange && !isUnderground) {
                console.log(`   🔄 Intentando con rango de popularidad más amplio...`);
                const relaxedMin = Math.max(0, popularity.min - 15);
                const relaxedMax = Math.min(100, popularity.max + 15);
                const relaxedTracks = uniqueTracks.filter(
                    track => track.popularity >= relaxedMin && track.popularity <= relaxedMax
                );
                if (relaxedTracks.length > finalPlaylist.length) {
                    const shuffledRelaxed = relaxedTracks.sort(() => Math.random() - 0.5);
                    finalPlaylist = shuffledRelaxed.slice(0, neededFromGenerated);
                    console.log(`   ✓ Con popularidad relajada [${relaxedMin}-${relaxedMax}]: ${finalPlaylist.length} tracks`);
                }
            } else if (isUnderground) {
                console.log(`   🎯 Búsqueda underground: manteniendo filtros estrictos`);
            }
        }
        console.log(`✂️ [generatePlaylist] Cortadas a ${finalPlaylist.length} (objetivo: ${numSongs}, reservando ${selectedTracks.length} para seleccionados)`);
        
        // Juntar con las seleccionadas
        finalPlaylist.push(...selectedTracks);

        // Eliminar duplicados finales
        finalPlaylist = Array.from(
            new Map(finalPlaylist.map(track => [track.id, track])).values()
        );

        // Mezcla final
        finalPlaylist = finalPlaylist.sort(() => Math.random() - 0.5);

        console.log(`✅ [generatePlaylist] Playlist final generada con ${finalPlaylist.length} tracks`);
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

        // Añadimos las canciones a la playlist
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
    
    // Obtener IDs únicos de artistas
    const artistIds = [...new Set(
        tracks.flatMap(track => 
            track.artists ? track.artists.map(artist => artist.id) : []
        )
    )];
    
    console.log(`🎨 [addGenresToTracks] Obteniendo géneros para ${artistIds.length} artistas únicos...`);
    
    const artistGenres = new Map();
    
    // Procesar en lotes de 50 (límite de Spotify API)
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < artistIds.length; i += batchSize) {
        batches.push(artistIds.slice(i, i + batchSize));
    }
    
    console.log(`   📦 Procesando ${batches.length} lotes de artistas`);
    
    // Procesar cada lote con un pequeño delay para evitar rate limiting
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        
        try {
            const response = await getMultipleArtists(batch);
            
            if (response?.data?.artists) {
                response.data.artists.forEach(artist => {
                    if (artist && artist.id) {
                        artistGenres.set(artist.id, artist.genres || []);
                    }
                });
            }
            
            // Pequeño delay entre batches para evitar rate limiting
            if (i < batches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error) {
            console.error(`Error obteniendo lote ${i + 1}:`, error);
            // Continuar con el siguiente lote incluso si uno falla
        }
    }
    
    console.log(`   ✓ Géneros obtenidos para ${artistGenres.size} artistas`);
    
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