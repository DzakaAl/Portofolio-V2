import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import soundTrack from '../assets/sound.mp3';

export default function AudioPlayer({ autoPlayTrigger }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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

  // Trigger audio playback seamlessly upon user click/enter interaction on Preloader
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log('Audio autoplay prevented by browser:', err);
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlayTrigger]);

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
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full glass-panel border border-white/20 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group ${
        isPlaying ? 'border-white/50 shadow-white/10' : 'hover:border-white/40'
      }`}
      title={isPlaying ? 'Mute Background Audio' : 'Play Background Audio'}
    >
      <div className="relative flex items-center justify-center">
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-white animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4 text-white/40 group-hover:text-white" />
        )}
      </div>

      <span className="font-tech text-xs font-bold tracking-wider text-white/90 uppercase">
        {isPlaying ? 'SOUND ON' : 'SOUND OFF'}
      </span>

      {/* Audio Wave Visualizer Animation when Playing */}
      {isPlaying && (
        <div className="flex items-end gap-0.5 h-3">
          <span className="w-0.5 h-full bg-white rounded-full animate-[bounce_1s_infinite_100ms]" />
          <span className="w-0.5 h-2/3 bg-white rounded-full animate-[bounce_1s_infinite_300ms]" />
          <span className="w-0.5 h-full bg-white rounded-full animate-[bounce_1s_infinite_200ms]" />
        </div>
      )}
    </button>
  );
}
