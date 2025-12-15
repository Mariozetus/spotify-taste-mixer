'use client';

// https://www.reactbits.dev/backgrounds/orb
import Orb from "@/components/Orb";

export default function Home() {

  return (
    <div className='relative flex items-center justify-center h-[calc(100vh-4rem)] px-6 overflow-hidden'>
      
      {/* Orb Background */}
      <div className='absolute inset-0 z-0 opacity-60'>
        <Orb
          hoverIntensity={0.1}
          rotateOnHover={true}
          hue={120}
          forceHoverState={false}
        />
      </div>
      
      {/* Content */}
      <div className='relative z-10 text-center w-full sm:w-2/3 mx-auto flex flex-col items-center justify-center gap-4'>
        <h1 className='text-4xl sm:text-6xl font-bold'>Spotify MixWave</h1>
        <p className='sm:text-sm text-xs font-medium text-pretty lg:w-2/4 md:w-2/3 sm:w-auto'>
          Aplicación web que genera playlists personalizadas de Spotify basándose en las preferencias musicales del usuario mediante widgets configurables.
        </p>
      </div>
    </div>
  );
}

