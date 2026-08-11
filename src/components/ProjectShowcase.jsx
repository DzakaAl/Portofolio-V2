import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ProjectShowcase() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const containerRef = useRef(null);
  const pinnedRef = useRef(null);

  const projects = [
    {
      id: 'cyber-arcade',
      title: 'CYBER ARCADE 2099',
      subtitle: 'WebGL Synthwave Fighter Game',
      category: 'GAME DEV / WEBGL',
      description: 'Interactive high-speed synthwave arcade spaceship battle game engine built with React Three Fiber, custom shaders, and spatial audio.',
      tags: ['REACT', 'THREE.JS', 'WEBGL', 'TAILWIND', 'GLSL'],
      image: '/assets/synthwave-game.jpg',
      stats: { fps: '60 FPS', rank: 'A+', year: '2026' },
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com'
    },
    {
      id: 'neon-vault',
      title: 'NEON VAULT dAPP',
      subtitle: 'Futuristic Crypto Asset Interface',
      category: 'WEB3 / FINTECH',
      description: 'Decentralized liquidity vault management protocol featuring real-time interactive charts, dark mode glassmorphism UI, and smart contract integration.',
      tags: ['REACT', 'ETHERS.JS', 'SOLIDITY', 'TAILWIND', 'VIEM'],
      image: '/assets/synthwave-game.jpg',
      stats: { tvl: '$42M', rank: 'PRO', year: '2025' },
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com'
    },
    {
      id: 'aether-engine',
      title: 'AETHER 3D STUDIO',
      subtitle: 'Realtime Browser Renderer',
      category: 'CREATIVE TOOL',
      description: 'Browser-based node renderer and shader editor designed for 3D artists, game creators, and visual experience designers.',
      tags: ['REACT', 'WEBGPU', 'CANVAS', 'TYPESCRIPT'],
      image: '/assets/synthwave-game.jpg',
      stats: { speed: '120Hz', rank: 'S-TIER', year: '2026' },
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com'
    }
  ];

  const currentProject = projects[activeProjectIndex];

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${projects.length * 220}%`,
        pin: pinnedRef.current,
        pinSpacing: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress;
          const scrollRange = 0.85;
          const clamped = Math.min(progress / scrollRange, 1);
          const currentPos = clamped * (projects.length - 1);
          setScrollProgress(currentPos);
          setIsFinished(progress > 0.88);

          const nearestIdx = Math.min(
            Math.round(currentPos),
            projects.length - 1
          );
          setActiveProjectIndex(nearestIdx);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [projects.length]);

  return (
    <div ref={containerRef} className="relative w-full bg-black select-none">

      <section
        ref={pinnedRef}
        id="work"
        className="relative h-screen w-full flex flex-col justify-between pt-20 pb-12 px-5 sm:px-10 lg:px-14 max-w-[1600px] mx-auto overflow-hidden"
      >

        {/* Background glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-white/[0.03] rounded-full blur-[180px] pointer-events-none" />

        {/* Header — Section title (Posisi diturunkan dan jarak disesuaikan) */}
        <div className="flex items-end justify-between pt-8 mt-12 mb-4 z-10 shrink-0">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-tech text-white tracking-tight leading-none">
              FEATURED WORK
            </h2>
          </div>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center flex-1 min-h-0 z-10">

          {/* ── LEFT: Ultra-Premium Pure 16:9 Image 3D Card ── */}
          <div
            className="lg:col-span-7 flex justify-center items-center relative overflow-visible h-full"
            style={{ perspective: '1600px', perspectiveOrigin: '50% 50%' }}
          >
            <div className="relative w-full flex items-center justify-center h-full">
              {projects.map((project, index) => {
                const offset = index - scrollProgress;
                const absOffset = Math.abs(offset);

                if (absOffset > 0.99) return null;

                // Dynamic ultra-smooth 3D transforms
                const rotateY   = offset * -45;
                const rotateX   = offset * 18;
                const rotateZ   = offset * -6;
                const skewY     = offset * -3;
                const translateX = offset * 50;
                const translateY = offset * 70;
                const translateZ = -absOffset * 320;
                const scale     = 1 - absOffset * 0.12;
                const opacity   = Math.pow(1 - absOffset, 2);

                return (
                  <div
                    key={project.id}
                    style={{
                      transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) skewY(${skewY}deg) scale(${scale})`,
                      opacity,
                      zIndex: Math.round(10 - absOffset * 5),
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
                    }}
                    className="absolute w-full max-w-[580px] sm:max-w-[680px] select-none"
                  >
                    {/* Floating Glass Frame around pure 16:9 Image */}
                    <div
                      className="rounded-3xl p-[1px] relative group"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.2) 100%)',
                        boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 50px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.2)',
                      }}
                    >
                      <div className="bg-[#050505] rounded-3xl overflow-hidden p-2">
                        {/* Pure 16:9 Image container - clean without text overlay inside */}
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            style={{ filter: 'brightness(0.92) contrast(1.08)' }}
                          />
                          {/* Premium subtle light reflection overlay */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%)' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Ultra-Premium Modern Minimalist Project Info ── */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-6">

            <div
              key={activeProjectIndex}
              className="space-y-4"
              style={{ animation: 'premiumReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black font-tech text-white tracking-tight leading-[1.05]">
                {currentProject.title}
              </h3>

              <p className="text-white/60 text-base leading-relaxed font-light max-w-md pt-1">
                {currentProject.description}
              </p>
            </div>

            {/* Tech stack tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {currentProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/60 text-xs font-mono font-medium tracking-wider hover:text-white hover:border-white/30 transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Premium Preview Button */}
            <div className="pt-2">
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-extrabold text-xs tracking-[0.15em] uppercase shadow-[0_10px_35px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_45px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300"
              >
                <span>Preview Project</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

        {/* ── BOTTOM BAR — "More Projects" appears prominently when finished ── */}
        <div className="shrink-0 pt-4 z-10 flex items-center justify-end">
          <a
            href="/projects"
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-extrabold text-xs tracking-[0.15em] uppercase shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-500 group ${
              isFinished ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'
            }`}
          >
            <span>More Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </section>

      {/* Premium reveal animation keyframes */}
      <style>{`
        @keyframes premiumReveal {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
      `}</style>
    </div>
  );
}
