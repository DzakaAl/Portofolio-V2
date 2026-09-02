'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const soundTrack = '/assets/sound.mp3';

/**
 * Global Audio Player - tersedia di semua halaman via root layout.
 * - Default hanya ikon; label "SOUND ON/OFF" + visualizer muncul saat hover.
 * - Auto-play dipicu dari Preloader home pada inisialisasi.
 */
export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Local Ambient Sound Track loaded directly from src/assets/sound.mp3
    audioRef.current = new Audio(soundTrack);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Auto-play via event dari Preloader home (dipicu hanya di awal)
  const startPlay = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        // Browser butuh gesture pengguna: putar pada klik/enter pertama setelahnya
        const gesturePlay = () => {
          if (!audioRef.current) return;
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          window.removeEventListener('click', gesturePlay);
          document.removeEventListener('keydown', gesturePlay);
        };
        window.addEventListener('click', gesturePlay, { once: true });
        document.addEventListener('keydown', gesturePlay, { once: true });
      });
  }, []);

  useEffect(() => {
    window.addEventListener('start-portfolio-audio', startPlay);
    return () => window.removeEventListener('start-portfolio-audio', startPlay);
  }, [startPlay]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  return (
    <button
      onClick={toggleAudio}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center gap-3 rounded-full glass-panel-strong border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 group p-3.5 ${
        isPlaying ? 'border-white/50 shadow-white/10' : 'hover:border-white/40'
      }`}
      title={isPlaying ? 'Mute Background Audio' : 'Play Background Audio'}
    >
      <div className="relative flex items-center justify-center">
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-white animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-white/40 group-hover:text-white" />
        )}
      </div>

      {/* Label SOUND ON/OFF + wave visualizer — tampil saat hover */}
      <span className="hidden group-hover:flex items-center gap-3 whitespace-nowrap">
        <span className="font-tech text-xs font-bold tracking-wider text-white/90 uppercase">
          {isPlaying ? 'SOUND ON' : 'SOUND OFF'}
        </span>
        {isPlaying && (
          <span className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-full bg-white rounded-full animate-[bounce_1s_infinite_100ms]" />
            <span className="w-0.5 h-2/3 bg-white rounded-full animate-[bounce_1s_infinite_300ms]" />
            <span className="w-0.5 h-full bg-white rounded-full animate-[bounce_1s_infinite_200ms]" />
          </span>
        )}
      </span>
    </button>
  );
}