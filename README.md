
# 🎧 Spotify Taste Mixer

¡Crea playlists personalizadas de Spotify en segundos, según tu mood y preferencias!

![Spotify Taste Mixer Banner](public/spotify-mixer-banner.png)

## 🚀 ¿Qué es Spotify Taste Mixer?
Spotify Taste Mixer es una aplicación web moderna que te permite generar playlists únicas y personalizadas usando tus artistas, géneros, décadas, popularidad, moods y canciones favoritas de Spotify. Todo con una interfaz visual, rápida y divertida.

## ✨ Características principales
- **Widgets interactivos** para elegir artistas, géneros, décadas, moods y popularidad
- **Arrastra y reordena** las canciones de tu playlist generada
- **Guarda y exporta** tu playlist directamente a tu cuenta de Spotify
- **Historial** de playlists generadas y favoritas
- **Modo oscuro/oscuro automático**
- **Responsive**: funciona perfecto en móvil, tablet y desktop
- **Login seguro** con OAuth de Spotify

## 🖼️ Capturas de pantalla

![Dashboard](public/screenshots/dashboard.png)
![Widgets](public/screenshots/widgets.png)
![Playlist](public/screenshots/playlist.png)

## 🛠️ Instalación y ejecución local

1. **Clona el repositorio:**
	```bash
	git clone https://github.com/tuusuario/spotify-taste-mixer.git
	cd spotify-taste-mixer
	```
2. **Instala dependencias:**
	```bash
	npm install
	```
3. **Configura tus credenciales de Spotify:**
	- Crea una app en [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
	- Copia tu `Client ID` y `Client Secret`
	- Crea un archivo `.env.local` y añade:
	  ```env
	  SPOTIFY_CLIENT_ID=tu_client_id
	  SPOTIFY_CLIENT_SECRET=tu_client_secret
	  NEXT_PUBLIC_BASE_URL=http://localhost:3000
	  ```
4. **Inicia la app:**
	```bash
	npm run dev
	```
5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Stack tecnológico
- **Next.js 14** (App Router)
- **React 18**
- **TailwindCSS**
- **Spotify Web API**
- **dnd-kit** (drag & drop)


## Licencia
MIT

---

> Hecho con ❤️ por Mario
