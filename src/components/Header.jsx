'use client';

import { useEffect, useState } from "react";
import { FaArrowUpRightFromSquare as RedirectIcon} from "react-icons/fa6";
import { MdOutlineWorkspacePremium as PremiumBadge } from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";
import { useSpotifyUser } from "@/hooks/useSpotifyUser";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter, usePathname } from "next/navigation";
// Esta funcion redirigira al usuario a spotify para que nos de permisos y su token
import { getSpotifyAuthUrl, logout } from "@/lib/auth"; 
import Link from "next/link";

export function Header(){

    const { isAuthenticated, refresh: refreshAuth } = useAuth();
    const { user, refresh: refreshUser } = useSpotifyUser();
    const [ showUserMenu, setShowUserMenu ] = useState(false);
    const [ showMobileMenu, setShowMobileMenu ] = useState(false);
    const [ isClient, setIsClient ] = useState(false);
    const [ theme, setTheme ] = useLocalStorage('theme', null);
    const router = useRouter();
    const pathname = usePathname();
    const dropdownRef = useClickOutside(() => setShowUserMenu(false));

    useEffect(() => {
        setIsClient(true);
        refreshAuth(); 
        refreshUser();
        
        // Detectar preferencia del sistema si no hay tema guardado
        if (!theme && typeof window !== 'undefined') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = prefersDark ? 'dark' : 'light';
            setTheme(initialTheme);
            document.documentElement.classList.toggle('dark', prefersDark);
        } else if (theme) {
            document.documentElement.classList.toggle('dark', theme === 'dark');
        }
    },[])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleLogout = () => {
        logout();
        // Forzar recarga completa para sincronizar cookies y limpiar estado
        window.location.href = '/';
    };

    const handleLogin = () => {
        // Verificar si necesitamos forzar reautenticación
        const forceReauth = sessionStorage.getItem('force_reauth') === 'true';
        if (forceReauth) {
            sessionStorage.removeItem('force_reauth');
        }
        // window.location.href necesario para OAuth redirect externo
        window.location.href = getSpotifyAuthUrl(forceReauth);
    }



    return(
        <header className="flex border-b border-background-inverse/20 items-center justify-between bg-background-base w-screen h-header py-2 px-4 sm:px-6 gap-4 z-20">
            
            {/* ========================= MOVIL WITHOUT SESION ========================= */}
            {isClient && !isAuthenticated && (
                <div className="flex items-center gap-3 lg:hidden">
                    <button 
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="flex flex-col gap-1.5 p-2 cursor-pointer"
                    >
                        <span className={`block w-6 h-0.5 bg-background-inverse transition-all duration-300 ${showMobileMenu ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-background-inverse transition-all duration-300 ${showMobileMenu ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-background-inverse transition-all duration-300 ${showMobileMenu ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                    <Link href='/' className="h-full cursor-pointer flex items-center">
                        <svg height="28" className="fill-text-base" aria-hidden="false" aria-label="Spotify" data-encore-id="logoSpotify" role="img" viewBox="0 0 24 24"><title>Spotify</title><path d="M12.477.01C5.855-.253.274 4.902.011 11.524c-.263 6.623 4.892 12.204 11.515 12.466 6.622.263 12.203-4.892 12.466-11.514S19.099.272 12.477.01m5.066 17.579a.717.717 0 0 1-.977.268 14.4 14.4 0 0 0-5.138-1.747 14.4 14.4 0 0 0-5.42.263.717.717 0 0 1-.338-1.392 15.8 15.8 0 0 1 5.958-.29c2.003.282 3.903.928 5.647 1.92a.717.717 0 0 1 .268.978m1.577-3.15a.93.93 0 0 1-1.262.376 17.7 17.7 0 0 0-5.972-1.96 17.7 17.7 0 0 0-6.281.238.93.93 0 0 1-1.11-.71.93.93 0 0 1 .71-1.11 19.5 19.5 0 0 1 6.94-.262 19.5 19.5 0 0 1 6.599 2.165c.452.245.62.81.376 1.263m1.748-3.551a1.147 1.147 0 0 1-1.546.488 21.4 21.4 0 0 0-6.918-2.208 21.4 21.4 0 0 0-7.259.215 1.146 1.146 0 0 1-.456-2.246 23.7 23.7 0 0 1 8.034-.24 23.7 23.7 0 0 1 7.657 2.445c.561.292.78.984.488 1.546"/></svg>
                    </Link>
                </div>
            )}

            {/* ========================= MOVIL WITH SESION ========================= */}
            {isClient && isAuthenticated && (
                <Link href='/' className="lg:hidden h-full cursor-pointer flex items-center">
                    <svg height="28" className="fill-text-base" aria-hidden="false" aria-label="Spotify" data-encore-id="logoSpotify" role="img" viewBox="0 0 24 24"><title>Spotify</title><path d="M12.477.01C5.855-.253.274 4.902.011 11.524c-.263 6.623 4.892 12.204 11.515 12.466 6.622.263 12.203-4.892 12.466-11.514S19.099.272 12.477.01m5.066 17.579a.717.717 0 0 1-.977.268 14.4 14.4 0 0 0-5.138-1.747 14.4 14.4 0 0 0-5.42.263.717.717 0 0 1-.338-1.392 15.8 15.8 0 0 1 5.958-.29c2.003.282 3.903.928 5.647 1.92a.717.717 0 0 1 .268.978m1.577-3.15a.93.93 0 0 1-1.262.376 17.7 17.7 0 0 0-5.972-1.96 17.7 17.7 0 0 0-6.281.238.93.93 0 0 1-1.11-.71.93.93 0 0 1 .71-1.11 19.5 19.5 0 0 1 6.94-.262 19.5 19.5 0 0 1 6.599 2.165c.452.245.62.81.376 1.263m1.748-3.551a1.147 1.147 0 0 1-1.546.488 21.4 21.4 0 0 0-6.918-2.208 21.4 21.4 0 0 0-7.259.215 1.146 1.146 0 0 1-.456-2.246 23.7 23.7 0 0 1 8.034-.24 23.7 23.7 0 0 1 7.657 2.445c.561.292.78.984.488 1.546"/></svg>
                </Link>
            )}
            
            {/* ========================= DESKTOP ========================= */}
            <Link href='/' className="hidden lg:flex h-full cursor-pointer items-center">
                <svg height="28" className="sm:h-8 fill-text-base" aria-hidden="false" aria-label="Spotify" data-encore-id="logoSpotify" role="img" viewBox="0 0 24 24"><title>Spotify</title><path d="M12.477.01C5.855-.253.274 4.902.011 11.524c-.263 6.623 4.892 12.204 11.515 12.466 6.622.263 12.203-4.892 12.466-11.514S19.099.272 12.477.01m5.066 17.579a.717.717 0 0 1-.977.268 14.4 14.4 0 0 0-5.138-1.747 14.4 14.4 0 0 0-5.42.263.717.717 0 0 1-.338-1.392 15.8 15.8 0 0 1 5.958-.29c2.003.282 3.903.928 5.647 1.92a.717.717 0 0 1 .268.978m1.577-3.15a.93.93 0 0 1-1.262.376 17.7 17.7 0 0 0-5.972-1.96 17.7 17.7 0 0 0-6.281.238.93.93 0 0 1-1.11-.71.93.93 0 0 1 .71-1.11 19.5 19.5 0 0 1 6.94-.262 19.5 19.5 0 0 1 6.599 2.165c.452.245.62.81.376 1.263m1.748-3.551a1.147 1.147 0 0 1-1.546.488 21.4 21.4 0 0 0-6.918-2.208 21.4 21.4 0 0 0-7.259.215 1.146 1.146 0 0 1-.456-2.246 23.7 23.7 0 0 1 8.034-.24 23.7 23.7 0 0 1 7.657 2.445c.561.292.78.984.488 1.546"/></svg>
            </Link>
            
            <div className="hidden lg:flex font-extrabold text-xl" suppressHydrationWarning>
                <Link href="/" className={`mx-16 transition-colors ${pathname === '/' ? 'text-text-base' : 'text-text-subdued hover:text-text-base'}`}>Home</Link>
                {isClient && isAuthenticated && <Link href="/dashboard" className={`mr-16 transition-colors ${pathname === '/dashboard' ? 'text-text-base' : 'text-text-subdued hover:text-text-base'}`}>Dashboard</Link>}
                {isClient && isAuthenticated && <Link href="/favorites" className={`mr-16 transition-colors ${pathname === '/favorites' ? 'text-text-base' : 'text-text-subdued hover:text-text-base'}`}>Favorites</Link>}
                {isClient && isAuthenticated && <Link href="/history" className={`mr-16 transition-colors ${pathname === '/history' ? 'text-text-base' : 'text-text-subdued hover:text-text-base'}`}>History</Link>}
                <Link href="/about" className={`transition-colors ${pathname === '/about' ? 'text-text-base' : 'text-text-subdued hover:text-text-base'}`}>About</Link>
            </div>

            {/* ========================= MOVIL OVERLAY ========================= */}
            {showMobileMenu && isClient && (
                <div className="lg:hidden fixed inset-0 bg-background-base bg-opacity-95 z-40 flex flex-col items-start justify-start p-6">
                    <button 
                        onClick={() => setShowMobileMenu(false)}
                        className="absolute top-6 right-6 text-3xl cursor-pointer"
                    >
                        ✕
                    </button>
                    
                    {isAuthenticated && (
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-background-inverse/20 w-full">
                        <img 
                            src={user?.images[0]?.url} 
                            className="w-16 h-16 rounded-full border-2 border-background-elevated-highlight"
                            alt={user?.display_name}
                        />
                        <div className="flex flex-col">
                            <span className="font-mono font-semibold text-lg">{user?.display_name}</span>
                            <div className="flex items-center gap-2">
                                {user?.product === 'premium' && (
                                    <PremiumBadge className="text-essential-bright-accent" />
                                )}
                                <span className="text-sm text-text-base/70">{user?.id}</span>
                                <a 
                                    className="hover:scale-110 transition-transform" 
                                    href={user?.external_urls?.spotify}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                > 
                                    <RedirectIcon className="size-3"/>
                                </a>
                            </div>
                        </div>
                        </div>
                    )}

                    <nav className="flex flex-col items-start gap-6 text-2xl font-extrabold w-full mb-8">
                        <Link href="/" onClick={() => setShowMobileMenu(false)} className={`transition-colors ${pathname === '/' ? 'text-text-base' : 'text-text-subdued hover:text-text-base'}`}>Home</Link>
                        {isAuthenticated && <Link href="/dashboard" onClick={() => setShowMobileMenu(false)} className={`transition-colors ${pathname === '/dashboard' ? 'text-text-base' : 'text-text-subdued hover:text-text-base'}`}>Dashboard</Link>}
                        {isAuthenticated && <Link href="/favorites" onClick={() => setShowMobileMenu(false)} className={`transition-colors ${pathname === '/favorites' ? 'text-text-base' : 'text-text-subdued hover:text-text-base'}`}>Favorites</Link>}
                        {isAuthenticated && <Link href="/history" onClick={() => setShowMobileMenu(false)} className={`transition-colors ${pathname === '/history' ? 'text-text-base' : 'text-text-subdued hover:text-text-base'}`}>History</Link>}
                        <Link href="/about" onClick={() => setShowMobileMenu(false)} className={`transition-colors ${pathname === '/about' ? 'text-text-base' : 'text-text-subdued hover:text-text-base'}`}>About</Link>
                    </nav>

                    <button
                        onClick={toggleTheme}
                        className="w-full border border-text-base/10 py-3 px-6 rounded-full bg-background-elevated-base text-text-subdued hover:bg-background-elevated-highlight font-semibold transition-all mb-4 flex items-center justify-center gap-3 cursor-pointer"
                    >
                        {theme === 'light' ? (
                            <>
                                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8.001 8.001 0 1 0 10.586 10.586"/></svg>
                                Dark Mode
                            </>
                        ) : (
                            <>
                                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1m4 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0m-.464 4.95.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 1.414m2.12-10.607a1 1 0 0 1 0 1.414l-.706.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zM17 11a1 1 0 1 0 0-2h-1a1 1 0 1 0 0 2zm-7 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1M5.05 6.464A1 1 0 1 0 6.465 5.05l-.708-.707a1 1 0 0 0-1.414 1.414zm1.414 8.486-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414M4 11a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2z" clipRule="evenodd"/></svg>
                                Light Mode
                            </>
                        )}
                    </button>

                    {isAuthenticated && (
                        <button
                            onClick={() => {
                                handleLogout();
                                setShowMobileMenu(false);
                            }}
                            className="w-full py-3 px-6 rounded-full border border-text-base/10 bg-background-elevated-base text-text-subdued hover:bg-background-elevated-highlight font-semibold transition-all cursor-pointer"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}

            {/* ========================= CON SESION ========================= */}
            {isClient && isAuthenticated ? (
                <>
                    <div className="lg:hidden flex items-center gap-3">
                        <button 
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="flex flex-col gap-1.5 p-2 cursor-pointer"
                        >
                            <span className={`block w-6 h-0.5 bg-background-inverse transition-all duration-300 ${showMobileMenu ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-background-inverse transition-all duration-300 ${showMobileMenu ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-background-inverse transition-all duration-300 ${showMobileMenu ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </button>
                    </div>

                    <div ref={dropdownRef} className="hidden lg:block h-full relative ml-auto">
                    <button onClick={() => setShowUserMenu(!showUserMenu)} className="h-full flex items-center gap-2 sm:gap-4 ">
                        <span className="font-mono font-semibold text-sm md:text-base">{user?.display_name}</span>
                        <img src={user?.images[0]?.url} className="aspect-square h-full rounded-full border-2 border-background-elevated-highlight hover:scale-105 duration-300 cursor-pointer"></img>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 w-full p-1 mt-1 divide-y divide-background-elevated-highlight origin-top-right rounded-md bg-background-elevated-base border border-background-elevated-highlight transition transition-discrete shadow-lg z-50">
                            <div className="py-1">
                                <div className="flex items-center justify-start gap-2 px-4 py-2">
                                    {user?.product === 'premium' && (
                                            <a><PremiumBadge></PremiumBadge></a>
                                        )
                                    }
                                    <span className=" text-sm text-text-subdued">{user?.id}</span>
                                    {/*_blank hace que se abra en otra ventana y noopener y noreferrer es para evitar 
                                    enviarle informacion a la pagina a la que se redirecciona sobre nuestra web*/}
                                    <a className="hover:scale-105" href={user?.external_urls?.spotify}
                                        target="_blank" rel="noopener noreferrer"> 
                                        <RedirectIcon className="size-3"/>
                                    </a>
                                </div>
                            </div>
                            
                            <div className="py-1">
                                <button 
                                    onClick={toggleTheme}
                                    className="w-full rounded-md text-left px-4 py-2 text-sm text-text-subdued hover:bg-background-elevated-highlight cursor-pointer focus:outline-hidden flex items-center gap-2"
                                >
                                    {theme === 'light' ? (
                                        <>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                                            </svg>
                                            Dark Mode
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                                            </svg>
                                            Light Mode
                                        </>
                                    )}
                                </button>
                            </div>
                            
                            <div className="py-1">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full rounded-md text-left px-4 py-2 text-sm text-text-subdued hover:bg-background-elevated-highlight focus:outline-hidden cursor-pointer">Logout</button>
                            </div>
                        </div>
                    )}
                    </div>
                </>
            ) : (
                <button 
                    onClick={handleLogin}
                    className="font-bold text-text-subdued hover:text-text-base ml-auto cursor-pointer py-1 px-3 sm:px-4 text-sm sm:text-base hover:scale-105 transition-all duration-300"
                >
                    Login
                </button>
            )
            }
        </header>
    )
}