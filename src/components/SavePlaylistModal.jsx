'use client';

import { useClickOutside } from '@/hooks/useClickOutside';
import { useState } from 'react';

export default function SavePlaylistModal({ 
    isOpen, 
    onClose, 
    onSave, 
    defaultName = 'My Taste Mix',
    defaultDescription = 'Created with Spotify Taste Mixer'
}) {
    const [playlistName, setPlaylistName] = useState(defaultName);
    const [playlistDescription, setPlaylistDescription] = useState(defaultDescription);
    const [playlistCover, setPlaylistCover] = useState(null);
    const [error, setError] = useState(null);
    const dropdownRef = useClickOutside(onClose);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Verificar que sea una imagen
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Verificar tamaño (máximo 256KB para Spotify)
        if (file.size > 256 * 1024) {
            setError('Image must be less than 256KB');
            return;
        }

        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            // Remover el prefijo 'data:image/...;base64,'
            const base64String = reader.result.split(',')[1];
            setPlaylistCover(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        onSave({
            name: playlistName,
            description: playlistDescription,
            cover: playlistCover
        });
    };

    const handleClose = () => {
        setPlaylistName(defaultName);
        setPlaylistDescription(defaultDescription);
        setPlaylistCover(null);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-background-base bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div ref={dropdownRef} className="bg-background-elevated-base grid grid-cols-1 sm:grid-cols-2 rounded-lg p-4 sm:p-6 max-w-md w-full border border-background-elevated-highlight">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 col-span-1 sm:col-span-2">Save to Spotify</h2>
                
                <div className="mb-4 sm:mb-6 row-span-1 sm:row-span-2 flex justify-center items-center col-span-1">
                    <label htmlFor="cover-upload" className="cursor-pointer block group">
                        <input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg bg-background-elevated-highlight border-2 border-background-elevated-press flex items-center justify-center overflow-visible">
                            {playlistCover ? (
                                <>
                                    <img
                                        src={`data:image/jpeg;base64,${playlistCover}`}
                                        alt="Playlist cover"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-background-base/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setPlaylistCover(null);
                                        }}
                                        className="absolute top-1 right-1 w-8 h-8 bg-background-elevated-base rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:scale-110 z-10"
                                        title="Remove cover"
                                    >
                                        <svg fill="currentColor" className="w-4 h-4 text-text-base" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 0 0-.894.553L7.382 4H4a1 1 0 0 0 0 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a1 1 0 1 0 0-2h-3.382l-.724-1.447A1 1 0 0 0 11 2zM7 8a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0zm5-1a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1" clipRule="evenodd"/></svg>
                                    </button>
                                </>
                            ) : (
                                <div className="relative text-center p-4 w-full h-full flex items-center justify-center">
                                    <div className="group-hover:opacity-0 transition-opacity duration-200">
                                        <svg className="w-12 h-12 mx-auto mb-2 text-text-subdued" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-xs text-text-subdued">Click to upload</p>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <svg fill="none" stroke="currentColor" className="w-16 h-16" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15.232 5.232 3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572z"/></svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </label>
                </div>

                {error && (
                    <div className="col-span-1 sm:col-span-2 mb-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <div className="mb-3 sm:mb-4 col-span-1">
                    <label className="block text-xs sm:text-sm font-medium mb-2">Playlist Name</label>
                    <input
                        type="text"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background-base border border-background-elevated-highlight focus:border-essential-bright-accent outline-none transition-colors"
                        placeholder="My Taste Mix"
                    />
                </div>

                <div className="mb-4 col-span-1 sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium mb-2">Description</label>
                    <textarea
                        value={playlistDescription}
                        onChange={(e) => setPlaylistDescription(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background-base border border-background-elevated-highlight focus:border-essential-bright-accent outline-none transition-colors resize-none"
                        rows={3}
                        placeholder="Created with Spotify Taste Mixer"
                    />
                </div>

                <div className="flex gap-2 sm:gap-3 col-span-1 sm:col-span-2">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full bg-background-elevated-highlight hover:bg-background-elevated-press transition-colors duration-200 font-medium cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full bg-essential-bright-accent text-background-base hover:opacity-90 transition-opacity duration-200 font-bold cursor-pointer"
                    >
                        Save to Spotify
                    </button>
                </div>
            </div>
        </div>
    );
}
