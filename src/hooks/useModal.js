'use client';

import { useState, useCallback } from 'react';

export function useModal() {
    const [modal, setModal] = useState({ 
        isOpen: false, 
        title: '', 
        message: '', 
        type: 'info' 
    });
    
    const showModal = useCallback((title, message, type = 'info') => {
        setModal({ isOpen: true, title, message, type });
    }, []);
    
    const closeModal = useCallback(() => {
        setModal({ isOpen: false, title: '', message: '', type: 'info' });
    }, []);

    const showError = useCallback((title, message) => {
        showModal(title, message, 'error');
    }, [showModal]);

    const showSuccess = useCallback((title, message) => {
        showModal(title, message, 'success');
    }, [showModal]);

    const showWarning = useCallback((title, message) => {
        showModal(title, message, 'warning');
    }, [showModal]);

    return {
        modal,
        showModal,
        closeModal,
        showError,
        showSuccess,
        showWarning
    };
}
