import React, { useState, useRef, useEffect } from 'react';
import LiveWallpaper from './LiveWallpaper';
import CloudVideoHover from './CloudVideoHover';
import { gsap } from 'gsap';

export default function Hero({ onOpenContact }) {
  const heroRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const socialRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const text1 = "TURNING IDEAS";
  const text2 = "INTO CODE";

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars1 = line1Ref.current?.querySelectorAll('.type-char') || [];
      const chars2 = line2Ref.current?.querySelectorAll('.type-char') || [];
      const allChars = [...chars1, ...chars2];

      const tl = gsap.timeline({ delay: 0.3 });

      // Staggered typewriter reveal for characters
      tl.fromTo(
        allChars,
        { opacity: 0, y: 15, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.08,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );

      // Social icons entrance after typewriter completes
      tl.fromTo(
        socialRef.current?.children || [],
        { y: 30, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        },
        "-=0.2"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative min-h-screen flex flex-col justify-between items-center pt-24 pb-8 px-4 overflow-hidden bg-black select-none group/hero"
    >
      {/* 1. Dynamic Live Wallpaper Background */}
      <LiveWallpaper />

      {/* 2. Abstract Cloud-Shaped Video Hover Reveal */}
      <CloudVideoHover isHovered={isHovered} mousePos={mousePos} />

      {/* Center Main Hero Content */}
      <div className="w-full flex-1 flex flex-col justify-center items-center z-20 my-auto py-8">
        
        <div className="max-w-6xl mx-auto text-center flex flex-col items-center justify-center px-2">
          
          {/* Main Headline: TURNING IDEAS INTO CODE with smooth typewriter reveal */}
          <h1 className="flex flex-col items-center justify-center gap-1 select-none">
            <div ref={line1Ref} className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap leading-none">
              <span className="font-heading font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white text-glow-white uppercase">
                {text1.split('').map((char, index) => (
                  <span
                    key={index}
                    className="type-char inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            </div>

            <div ref={line2Ref} className="leading-none mt-2 sm:mt-4">
              <span className="font-heading font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white text-glow-white uppercase">
                {text2.split('').map((char, index) => (
                  <span
                    key={index}
                    className="type-char inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            </div>
          </h1>

        </div>

      </div>

      {/* 3. Bottom-Left Circular Social Buttons */}
      <div ref={socialRef} className="absolute bottom-12 left-6 sm:left-10 z-30 flex items-center gap-3 pointer-events-auto">
        <button
          onClick={onOpenContact}
          title="Send Email"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full glass-panel flex items-center justify-center border border-white/25 text-slate-300 hover:text-white hover:border-white hover:scale-110 hover:shadow-lg hover:shadow-white/20 transition-all duration-300"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full glass-panel flex items-center justify-center border border-white/25 text-slate-300 hover:text-white hover:border-white hover:scale-110 hover:shadow-lg hover:shadow-white/20 transition-all duration-300"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full glass-panel flex items-center justify-center border border-white/25 text-slate-300 hover:text-white hover:border-white hover:scale-110 hover:shadow-lg hover:shadow-white/20 transition-all duration-300"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
          </svg>
        </a>
        <a
          href="/assets/CV.pdf"
          download="Mordzz_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          title="Download CV"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full glass-panel flex items-center justify-center border border-white/25 text-slate-300 hover:text-white hover:border-white hover:scale-110 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 font-mono text-xs font-bold tracking-wider"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        </a>
      </div>

    </section>
  );
}

