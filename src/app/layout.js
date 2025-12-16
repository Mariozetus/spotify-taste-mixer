import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";

const spotifyFont = localFont({
  src: [
    {
      path: "./fonts/SpotifyMixUI-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SpotifyMixUI-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-spotify",
});

export const metadata = {
  title: "Spotify MixWave",
  description: "Creador de playlist",
  icons: {
    icon: [
      { url: '/spotify.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const item = localStorage.getItem('theme');
                const theme = item ? JSON.parse(item) : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {
                const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              }
            })();
          `
        }} />
      </head>
      <body className={`${spotifyFont.variable} antialiased`}>
        <Header/>
        {children}
      </body>
    </html>
  );
}
