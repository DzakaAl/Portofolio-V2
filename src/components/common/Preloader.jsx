import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, CornerDownLeft } from 'lucide-react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('LOADING ASSETS...');
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef(null);
  const percentRef = useRef(null);
  const statusRef = useRef(null);
  const progressBarRef = useRef(null);
  const enterBtnRef = useRef(null);

  useEffect(() => {
    // True page asset loading logic
    const images = Array.from(document.images);
    const videos = Array.from(document.querySelectorAll('video'));
    const totalAssets = images.length + videos.length + 1;
    let loadedAssets = 0;

    const updateProgress = () => {
      loadedAssets += 1;
      const calculated = Math.min(Math.round((loadedAssets / totalAssets) * 100), 99);
      setProgress((prev) => Math.max(prev, calculated));
    };

    images.forEach((img) => {
      if (img.complete) updateProgress();
      else {
        img.addEventListener('load', updateProgress);
        img.addEventListener('error', updateProgress);
      }
    });

    videos.forEach((vid) => {
      if (vid.readyState >= 3) updateProgress();
      else {
        vid.addEventListener('canplaythrough', updateProgress);
        vid.addEventListener('error', updateProgress);
      }
    });

    const handleWindowLoad = () => {
      setProgress(100);
      setStatusText('PRESS ENTER OR CLICK TO CONTINUE');
      setIsReady(true);
    };

    if (document.readyState === 'complete') {
      handleWindowLoad();
    } else {
      window.addEventListener('load', handleWindowLoad);
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatusText('PRESS ENTER OR CLICK TO CONTINUE');
          setIsReady(true);
          return 100;
        }

        const next = prev + 3;
        if (next > 30 && next < 60) setStatusText('LOADING IMAGES & MEDIA...');
        if (next >= 60 && next < 90) setStatusText('INITIALIZING GSAP ANIMATIONS...');
        if (next >= 90) setStatusText('FINALIZING PAGE...');
        return Math.min(next, 99);
      });
    }, 45);

    // GSAP Intro Entrance
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
          ease: 'power3.out'
        }
      );
    }, containerRef);

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleWindowLoad);
      ctx.revert();
    };
  }, []);

  const handleProceed = () => {
    if (!isReady) return;

    // GSAP Outro Exit Animation
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.04,
      filter: 'blur(12px)',
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        onComplete && onComplete();
      }
    });
  };

  // Listen for Enter key press when loading reaches 100%
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

      {/* Center Counter — Clean Pure Monochrome */}
      <div className="flex flex-col items-center justify-center space-y-6 my-auto">
        <div ref={percentRef} className="font-tech font-black text-8xl sm:text-[10rem] text-white tracking-tighter leading-none">
          {String(progress).padStart(2, '0')}<span className="text-white/40 text-5xl sm:text-7xl font-bold">%</span>
        </div>

        <div ref={statusRef} className="font-tech text-xs font-medium text-white/50 tracking-[0.3em] uppercase">
          {statusText}
        </div>

      </div>

      {/* Bottom Progress Track — Clean White */}
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
