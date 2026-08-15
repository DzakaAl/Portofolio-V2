import React, { useState, useRef, useEffect } from 'react';
import LiveWallpaper from '../../../components/ui/LiveWallpaper';
import CloudVideoHover from '../../../components/ui/CloudVideoHover';
import Button from '../../../components/ui/Button';
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

      tl.fromTo(
        allChars,
        { opacity: 0, y: 20, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power3.out',
        }
      );

      if (socialRef.current) {
        tl.fromTo(
          socialRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );
      }
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
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden select-none cursor-pointer"
    >
      <LiveWallpaper />

      <CloudVideoHover isHovered={isHovered} mousePos={mousePos} />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16 pointer-events-none">
        
        <div className="space-y-6 sm:space-y-8">
          
          <h1 className="flex flex-col items-center justify-center select-none">
            <div ref={line1Ref} className="leading-none">
              <span className="font-heading font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white/90 hover:text-white transition-colors duration-300 inline-block">
                {text1.split('').map((char, index) => (
                  <span
                    key={index}
                    className="type-char inline-block pointer-events-none"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            </div>

            <div ref={line2Ref} className="leading-none mt-2 sm:mt-4">
              <span className="font-heading font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white text-glow-white uppercase inline-block">
                {text2.split('').map((char, index) => (
                  <span
                    key={index}
                    className="type-char inline-block pointer-events-none"
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
        <Button
          onClick={onOpenContact}
          title="Send Email"
          variant="icon"
          size="icon"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </Button>

        <Button
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          variant="icon"
          size="icon"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </Button>
        <Button
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
          variant="icon"
          size="icon"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
          </svg>
        </Button>
        <Button
          href="/assets/CV.pdf"
          download="DzakaAl_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          title="Download CV"
          variant="icon"
          size="icon"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        </Button>
      </div>

    </section>
  );
}

