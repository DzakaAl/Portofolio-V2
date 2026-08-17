import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import soundTrack from '../../assets/sound.mp3';

export default function Preloader({ onComplete, apiPromises = [] }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING ASSETS...');
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef(null);
  const percentRef = useRef(null);
  const statusRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let targetProgress = 0;
    let currentProgress = 0;

    // Smooth counter animation loop (0 ke 100 tanpa lompat)
    const interval = setInterval(() => {
      if (!isMounted) return;
      if (currentProgress < targetProgress) {
        currentProgress += 1;
        setProgress(currentProgress);

        // Update teks deskripsi status sesuai persentase & aset yang dimuat
        if (currentProgress < 25) {
          setStatusText('CONNECTING TO SERVER & API...');
        } else if (currentProgress < 50) {
          setStatusText('LOADING UI IMAGES & GRAPHICS...');
        } else if (currentProgress < 75) {
          setStatusText('LOADING AUDIO & SPIDERMAN MEDIA...');
        } else if (currentProgress < 100) {
          setStatusText('SYNCHRONIZING INTERFACE & FONTS...');
        } else {
          setStatusText('PRESS ENTER OR CLICK TO CONTINUE');
          setIsReady(true);
        }
      }
    }, 25);

    // Helper untuk membungkus gambar menjadi Promise
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(src);
        img.src = src;
      });
    };

    // Helper untuk membungkus video menjadi Promise
    const loadVideo = (videoEl) => {
      return new Promise((resolve) => {
        if (videoEl.readyState >= 3) return resolve();
        videoEl.addEventListener('canplaythrough', () => resolve(), { once: true });
        videoEl.addEventListener('error', () => resolve(), { once: true });
      });
    };

    // Helper untuk membungkus audio/sound menjadi Promise
    const loadAudio = (srcOrAudio) => {
      return new Promise((resolve) => {
        const audio = typeof srcOrAudio === 'string' ? new Audio(srcOrAudio) : srcOrAudio;
        if (audio.readyState >= 3) return resolve();
        audio.addEventListener('canplaythrough', () => resolve(), { once: true });
        audio.addEventListener('error', () => resolve(), { once: true });
        if (typeof srcOrAudio === 'string') {
          audio.preload = 'auto';
          audio.load();
        }
      });
    };

    const startPreloading = async () => {
      const domImages = Array.from(document.images).map((img) => img.src).filter(Boolean);
      const bgImages = Array.from(document.querySelectorAll('*'))
        .map((el) => window.getComputedStyle(el).backgroundImage)
        .filter((bg) => bg && bg !== 'none' && bg.startsWith('url('))
        .map((bg) => bg.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, ''));

      const uniqueImageUrls = Array.from(new Set([...domImages, ...bgImages]));

      const imagePromises = uniqueImageUrls.map(loadImage);
      const videoPromises = Array.from(document.querySelectorAll('video')).map(loadVideo);
      const audioElements = Array.from(document.querySelectorAll('audio'));
      const audioPromises = [
        loadAudio(soundTrack),
        ...audioElements.map((aud) => loadAudio(aud)),
      ];
      const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();

      const allAssetPromises = [
        ...imagePromises,
        ...videoPromises,
        ...audioPromises,
        fontPromise,
        ...apiPromises,
      ];

      const totalItems = Math.max(allAssetPromises.length, 1);
      let completedItems = 0;

      const trackSinglePromise = (promise) => {
        return promise
          .then((res) => {
            if (isMounted) {
              completedItems += 1;
              targetProgress = Math.min(Math.round((completedItems / totalItems) * 100), 100);
            }
            return res;
          })
          .catch((err) => {
            if (isMounted) {
              completedItems += 1;
              targetProgress = Math.min(Math.round((completedItems / totalItems) * 100), 100);
            }
            return err;
          });
      };

      const trackedPromises = allAssetPromises.map(trackSinglePromise);
      const safetyTimeout = new Promise((resolve) => setTimeout(resolve, 5000));

      await Promise.race([
        Promise.allSettled(trackedPromises),
        safetyTimeout,
      ]);

      if (isMounted) {
        targetProgress = 100;
      }
    };

    startPreloading();

    // GSAP Intro Animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [percentRef.current, statusRef.current, progressBarRef.current],
        { opacity: 0, y: 25, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }, containerRef);

    return () => {
      isMounted = false;
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  const handleProceed = () => {
    if (!isReady) return;

    // Panggil callback complete secepatnya agar audio dan video langsung dipicu
    if (onComplete) onComplete();

    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.04,
      filter: 'blur(12px)',
      duration: 0.8,
      ease: 'power3.inOut',
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && isReady) {
        handleProceed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady]);

  return (
    <div
      ref={containerRef}
      onClick={handleProceed}
      className={`fixed inset-0 z-[100] bg-black flex flex-col justify-between p-8 sm:p-14 select-none ${
        isReady ? 'cursor-pointer' : 'cursor-wait'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-6 my-auto">
        <div ref={percentRef} className="font-tech font-black text-8xl sm:text-[10rem] text-white tracking-tighter leading-none">
          {String(progress).padStart(2, '0')}<span className="text-white/40 text-5xl sm:text-7xl font-bold">%</span>
        </div>

        <div ref={statusRef} className="font-tech text-xs font-medium text-white/50 tracking-[0.3em] uppercase">
          {statusText}
        </div>
      </div>

      <div ref={progressBarRef} className="w-full space-y-3 max-w-xl mx-auto">
        <div className="relative w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between font-tech text-[10px] font-semibold text-white/30 tracking-[0.2em] uppercase">
          <span>{isReady ? 'CLICK ANYWHERE OR PRESS ENTER' : 'LOADING PAGE ASSETS'}</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

