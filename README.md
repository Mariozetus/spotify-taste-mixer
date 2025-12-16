
# 🎧 Spotify Taste Mixer

¡Crea playlists personalizadas de Spotify en segundos, según tu mood y preferencias!

<img width="2559" height="1189" alt="imagen" src="https://github.com/user-attachments/assets/177ed198-5b49-4610-9630-29fcabb20315" />

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

<img width="2559" height="1187" alt="imagen" src="https://github.com/user-attachments/assets/c1069f90-7fa0-47ed-bd73-453410c77265" />

<img width="2559" height="1183" alt="imagen" src="https://github.com/user-attachments/assets/763a7272-716d-41cc-bbe1-7bbfb6175ad0" />

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
