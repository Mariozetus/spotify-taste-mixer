'use client';

import Link from 'next/link';
import { FaSpotify, FaGithub, FaReact } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss } from 'react-icons/si';

export default function AboutPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background-base text-text-base">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* ========================= HERO ========================= */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
                        About <span className="text-essential-bright-accent">Spotify MixWave</span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-text-subdued max-w-3xl mx-auto">
                        Tu asistente inteligente para crear playlists perfectas basadas en tu gusto musical
                    </p>
                </div>
                {/* ========================= INFO ========================= */}
                <section className="mb-16">
                    <div className="bg-background-elevated-base rounded-lg p-8 sm:p-12 border border-background-elevated-highlight">
                        <h2 className="text-3xl font-bold mb-6">¿Qué es Spotify MixWave?</h2>
                        <div className="space-y-4 text-lg text-text-subdued">
                            <p>
                                Spotify MixWave es una aplicación web que revoluciona la forma en que creas playlists en Spotify. 
                                Utilizando la potente API de Spotify, te permitimos generar listas de reproducción personalizadas 
                                basadas en múltiples criterios musicales.
                            </p>
                            <p>
                                Ya sea que busques canciones de una década específica, un género particular, un nivel de energía, 
                                o incluso descubrir artistas underground, nuestra aplicación te ayuda a encontrar la música perfecta 
                                para cada momento.
                            </p>
                        </div>
                    </div>
                </section>
                
                {/* ========================= FEATURES ========================= */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Características principales</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Búsqueda por Artista',
                                description: 'Selecciona tus artistas favoritos y descubre canciones similares o del mismo estilo.'
                            },
                            {
                                title: 'Filtros de Género',
                                description: 'Rock, Pop, Jazz, Hip-Hop... Encuentra música por género musical específico.'
                            },
                            {
                                title: 'Exploración por Década',
                                description: 'Viaja en el tiempo y descubre música de los 60s, 80s, 2000s y más.'
                            },
                            {
                                title: 'Estado de Ánimo',
                                description: 'Elige el mood perfecto: feliz, triste, energético, relajado...'
                            },
                            {
                                title: 'Nivel de Popularidad',
                                description: 'Desde éxitos mainstream hasta joyas underground poco conocidas.'
                            },
                            {
                                title: 'Búsqueda por Canción',
                                description: 'Usa canciones que te gustan como punto de partida para descubrir música similar.'
                            },
                            {
                                title: 'Favoritos',
                                description: 'Guarda tus canciones y artistas favoritos para acceso rápido.'
                            },
                            {
                                title: 'Historial',
                                description: 'Revisa todas las playlists que has creado anteriormente.'
                            },
                            {
                                title: 'Editor de Playlist',
                                description: 'Arrastra, reordena y elimina canciones antes de guardar en Spotify.'
                            }
                        ].map((feature, index) => (
                            <div 
                                key={index}
                                className="bg-background-elevated-base rounded-lg p-6 border border-background-elevated-highlight hover:border-essential-bright-accent transition-colors cursor-auto"
                            >
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-text-subdued">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ========================= TECNOLOGIAS ========================= */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Tecnologías utilizadas</h2>
                    <div className="bg-background-elevated-base rounded-lg p-8 sm:p-12 border border-background-elevated-highlight">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <a href='https://nextjs.org/'>
                                    <SiNextdotjs className="w-16 h-16 mx-auto mb-4 text-text-base" />
                                </a>
                                <h3 className="font-bold text-xl mb-2">Next.js 16</h3>
                                <p className="text-text-subdued">Framework React con App Router</p>
                            </div>
                            <div className="text-center">
                                <a href='https://es.react.dev/'>
                                    <FaReact className="w-16 h-16 mx-auto mb-4 text-text-base" />
                                </a>
                                <h3 className="font-bold text-xl mb-2">React 19</h3>
                                <p className="text-text-subdued">Biblioteca UI moderna</p>
                            </div>
                            <div className="text-center">
                                <a href='https://tailwindcss.com/'>
                                    <SiTailwindcss className="w-16 h-16 mx-auto mb-4 text-text-base" />
                                </a>
                                <h3 className="font-bold text-xl mb-2">Tailwind CSS</h3>
                                <p className="text-text-subdued">Estilado utility-first</p>
                            </div>
                            <div className="text-center">
                                <a href='https://developer.spotify.com/'>
                                    <FaSpotify className="w-16 h-16 mx-auto mb-4 text-text-base" />
                                </a>
                                <h3 className="font-bold text-xl mb-2">Spotify API</h3>
                                <p className="text-text-subdued">Web API oficial de Spotify</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* ========================= COMO FUNCIONA ========================= */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">¿Cómo funciona?</h2>
                    <div className="space-y-6">
                        {[
                            {
                                step: '1',
                                title: 'Inicia sesión con Spotify',
                                description: 'Conecta tu cuenta de Spotify de forma segura usando OAuth 2.0.'
                            },
                            {
                                step: '2',
                                title: 'Elige tus preferencias',
                                description: 'Selecciona artistas, géneros, décadas, mood, popularidad o canciones como base.'
                            },
                            {
                                step: '3',
                                title: 'Genera tu playlist',
                                description: 'Nuestro algoritmo inteligente busca las mejores canciones según tus criterios.'
                            },
                            {
                                step: '4',
                                title: 'Personaliza y guarda',
                                description: 'Edita el orden, elimina canciones que no te gusten y guarda directamente en tu cuenta de Spotify.'
                            }
                        ].map((item) => (
                            <div 
                                key={item.step}
                                className="flex gap-6 items-start bg-background-elevated-base rounded-lg p-6 border border-background-elevated-highlight"
                            >
                                <div className="shrink-0 w-12 h-12 rounded-full bg-essential-bright-accent flex items-center justify-center text-2xl font-bold text-background-base">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-text-subdued">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ========================= PRIVACIDAD ========================= */}
                <section className="mb-16">
                    <div className="bg-background-elevated-base rounded-lg p-8 sm:p-12 border border-background-elevated-highlight">
                        <h2 className="text-3xl font-bold mb-6">Privacidad y Seguridad</h2>
                        <div className="space-y-4 text-lg text-text-subdued">
                            <p>
                                Tu privacidad es nuestra prioridad. Solo solicitamos los permisos mínimos necesarios 
                                para crear y gestionar playlists en tu cuenta de Spotify.
                            </p>
                            <p>
                                No almacenamos tus credenciales de Spotify. Toda la autenticación se realiza de forma 
                                segura a través del sistema OAuth 2.0 oficial de Spotify.
                            </p>
                            <p>
                                Los datos se guardan localmente en tu navegador para mejorar tu experiencia. 
                                Puedes borrarlos en cualquier momento cerrando sesión.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="text-center mt-12">
                    <Link 
                        href="/"
                        className="text-text-subdued hover:text-text-base transition-colors inline-flex items-center gap-2"
                    >
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
