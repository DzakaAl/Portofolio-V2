'use client';
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  hideClose?: boolean;
}

/**
 * Reusable Modal Component
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-lg',
  className = '',
  hideClose = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    // Shift focus into modal container when opened to trap scroll events
    const focusTimer = setTimeout(() => {
      modalRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };

    // Lock page scroll and prevent background Lenis scroll bleed
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
    // onClose intentionally excluded (read via ref) — inline arrow props change every keystroke and would steal focus
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xl animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      data-lenis-prevent
    >
      {/* Backdrop overlay click */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        tabIndex={-1}
        data-lenis-prevent
        className={`relative z-10 w-full ${maxWidth} glass-panel-strong rounded-3xl overflow-hidden border border-white/20 p-6 sm:p-8 shadow-[0_40px_120px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto outline-none animate-in fade-in zoom-in-95 duration-300 ${className}`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button — fixed so it stays visible in tall scrollable modals */}
        {!hideClose && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="fixed top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/70 hover:text-white hover:bg-red-600/80 hover:border-red-500/80 hover:shadow-[0_0_14px_rgba(239,68,68,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {children}
      </div>
    </div>
  );
}
