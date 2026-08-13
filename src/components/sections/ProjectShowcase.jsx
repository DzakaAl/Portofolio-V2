import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFeaturedProjects } from '../../data/projects';
import Button from '../ui/Button';

export default function ProjectShowcase({ onNavigateToProjects }) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [projects, setProjects] = useState([]);

  const containerRef = useRef(null);
  const pinnedRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getFeaturedProjects().then((data) => {
      if (mounted) setProjects(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

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
          <div className="lg:col-span-5 flex flex-col justify-center gap-6 relative min-h-[360px] py-4">
            {projects.map((project, index) => {
              const offset = index - scrollProgress;
              const absOffset = Math.abs(offset);

              if (absOffset > 0.99) return null;

              // GSAP / Scroll progress based sync transformations for text elements
              const translateY = offset * 60; // Smooth vertical sliding transition
              const opacity = Math.max(0, 1 - absOffset * 1.8);
              const scale = 1 - absOffset * 0.08;
              // Micro subtle blur - sangat sebentar dan ringan
              const filterBlur = absOffset > 0.1 ? Math.min((absOffset - 0.1) * 4, 2) : 0;

              return (
                <div
                  key={project.id}
                  style={{
                    transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                    opacity,
                    filter: `blur(${filterBlur}px)`,
                    transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease, filter 0.15s ease',
                    pointerEvents: absOffset < 0.3 ? 'auto' : 'none',
                  }}
                  className="absolute inset-0 flex flex-col justify-center gap-6 py-2 px-2"
                >
                  <div className="space-y-4">

                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black font-tech text-white tracking-tight leading-[1.05]">
                      {project.title}
                    </h3>

                    <p className="text-white/60 text-base leading-relaxed font-light max-w-md pt-1">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/60 text-xs font-mono font-medium tracking-wider transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Premium Preview Button */}
                  <div className="pt-2">
                    <Button
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      variant="primary"
                      size="lg"
                      icon={ExternalLink}
                    >
                      Preview Project
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BOTTOM BAR — "More Projects" appears prominently when finished ── */}
        <div className="shrink-0 pt-4 z-10 flex items-center justify-end">
          <Button
            onClick={(e) => {
              if (e) e.preventDefault();
              if (onNavigateToProjects) onNavigateToProjects();
            }}
            variant="primary"
            size="md"
            icon={ArrowRight}
            className={`transition-all duration-500 ${
              isFinished ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'
            }`}
          >
            More Projects
          </Button>
        </div>

      </section>
    </div>
  );
}
