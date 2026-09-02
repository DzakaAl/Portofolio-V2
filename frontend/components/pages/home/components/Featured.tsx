'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFeaturedProjects } from '@/lib/api';
import Button from '@/components/ui/Button';
import ProjectPreviewModal from '@/components/ui/ProjectPreviewModal';
import { useLanguage } from '@/lib/i18n';
import type { Project } from '@/lib/types';

/**
 * Gaya slide kartu gambar (kiri) — diterapkan langsung ke DOM saat scroll agar
 * tidak memicu re-render React tiap frame (scroll jadi lebih ringan).
 */
function imageSlideStyle(offset: number) {
  const absOffset = Math.abs(offset);
  const rotateY = offset * -45;
  const rotateX = offset * 18;
  const rotateZ = offset * -6;
  const skewY = offset * -3;
  const translateX = offset * 50;
  const translateY = offset * 70;
  const translateZ = -absOffset * 320;
  const scale = 1 - absOffset * 0.12;
  return {
    transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) skewY(${skewY}deg) scale(${scale})`,
    opacity: Math.pow(1 - absOffset, 2),
    zIndex: Math.round(10 - absOffset * 5),
    pointerEvents: (absOffset < 0.5 ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
  };
}

/** Gaya slide teks/info project (kanan). */
function textSlideStyle(offset: number) {
  const absOffset = Math.abs(offset);
  const translateY = offset * 60;
  const opacity = Math.max(0, 1 - absOffset * 1.8);
  const scale = 1 - absOffset * 0.08;
  const filterBlur = absOffset > 0.1 ? Math.min((absOffset - 0.1) * 4, 2) : 0;
  return {
    transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
    opacity,
    filter: `blur(${filterBlur}px)`,
    zIndex: Math.round(20 - absOffset * 10),
    pointerEvents: (absOffset < 0.3 ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
  };
}

/** Terapkan gaya slide ke elemen DOM (tanpa re-render React). */
function applySlideStyle(
  el: HTMLDivElement,
  style: ReturnType<typeof imageSlideStyle> | ReturnType<typeof textSlideStyle>
) {
  el.style.visibility = 'visible';
  el.style.transform = style.transform;
  el.style.opacity = String(style.opacity);
  el.style.zIndex = String(style.zIndex);
  el.style.pointerEvents = style.pointerEvents ?? 'auto';
  if ('filter' in style) el.style.filter = (style as { filter: string }).filter;
}

interface ProjectShowcaseProps {
  onNavigateToProjects?: () => void;
  onOpenContact?: () => void;
}

export default function ProjectShowcase({
  onNavigateToProjects,
  onOpenContact,
}: ProjectShowcaseProps) {
  const { t, tl } = useLanguage();
  const [isFinished, setIsFinished] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [renderIndex, setRenderIndex] = useState(0); // hanya berubah saat slide index berganti (render ringan)

  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0); // posisi slide terkini (dibaca render & diupdate via scroll)
  const finishedRef = useRef(false);
  const renderIndexRef = useRef(0);
  const imageSlidesRef = useRef<Array<HTMLDivElement | null>>([]);
  const textSlidesRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    let mounted = true;
    getFeaturedProjects().then((data) => {
      if (mounted) setProjects(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cegah glitch di mobile: perubahan tinggi address bar tidak dianggap resize
      ScrollTrigger.config({ ignoreMobileResize: true });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${projects.length * 220}%`,
        pin: pinnedRef.current,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self: { progress: number }) => {
          const progress = self.progress;
          const scrollRange = 0.85;
          const clamped = Math.min(progress / scrollRange, 1);
          const pos = clamped * (projects.length - 1);
          progressRef.current = pos;

          // SetState ringan: re-render hanya saat index slide berganti (untuk mount slide tetangga)
          const nearest = Math.min(Math.round(pos), projects.length - 1);
          if (nearest !== renderIndexRef.current) {
            renderIndexRef.current = nearest;
            setRenderIndex(nearest);
          }

          // SetState ringan: hanya saat status "finished" benar-benar berubah
          const finished = progress > 0.88;
          if (finished !== finishedRef.current) {
            finishedRef.current = finished;
            setIsFinished(finished);
          }

          // Transform slide diterapkan langsung ke DOM (tanpa re-render React).
          // Slide di luar jangkauan disembunyikan total (visibility) agar tidak
          // muncul kedipan dari transform stale saat masuk kembali.
          for (let i = 0; i < imageSlidesRef.current.length; i++) {
            const el = imageSlidesRef.current[i];
            if (!el) continue;
            const offset = i - pos;
            if (Math.abs(offset) > 0.99) {
              el.style.visibility = 'hidden';
              el.style.opacity = '0';
              el.style.pointerEvents = 'none';
            } else {
              applySlideStyle(el, imageSlideStyle(offset));
            }
          }
          for (let i = 0; i < textSlidesRef.current.length; i++) {
            const el = textSlidesRef.current[i];
            if (!el) continue;
            const offset = i - pos;
            if (Math.abs(offset) > 0.99) {
              el.style.visibility = 'hidden';
              el.style.opacity = '0';
              el.style.pointerEvents = 'none';
            } else {
              applySlideStyle(el, textSlideStyle(offset));
            }
          }
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
        className="relative min-h-screen lg:h-screen w-full flex flex-col justify-between pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-14 max-w-[1600px] mx-auto overflow-hidden"
      >

        {/* Background glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-white/[0.03] rounded-full blur-[180px] pointer-events-none" />

        {/* Header ” Section title */}
        <div className="flex items-end justify-between pt-2 sm:pt-4 lg:pt-6 mt-2 sm:mt-4 lg:mt-8 mb-4 sm:mb-8 lg:mb-4 z-20 shrink-0">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-tech text-white tracking-tight leading-none">
              {t('featured.title')}
            </h2>
          </div>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 sm:gap-3 lg:gap-12 items-center flex-1 min-h-0 z-10">

          {/* LEFT: Ultra-Premium Pure 16:9 Image 3D Card */}
          <div
            className="lg:col-span-7 flex justify-center items-center relative overflow-visible h-[54vw] sm:h-[52vw] lg:h-full mt-2 sm:mt-4 lg:mt-0"
            style={{ perspective: '1600px', perspectiveOrigin: '50% 50%' }}
          >
            <div className="relative w-full flex items-center justify-center h-full">
              {projects.length === 0 && (
                <div className="w-full max-w-[580px] sm:max-w-[680px] aspect-video rounded-3xl bg-white/[0.03] border border-white/10 animate-pulse" />
              )}
              {projects.map((project, index) => {
                const offset = index - progressRef.current;

                if (Math.abs(index - renderIndex) > 1) return null;

                // Dynamic ultra-smooth 3D transforms (via helper global)
                const slideStyle = imageSlideStyle(offset);

                return (
                  <div
                    key={project.id}
                    ref={(el) => {
                      imageSlidesRef.current[index] = el;
                    }}
                    style={{
                      ...slideStyle,
                    }}
                    className="absolute w-full max-w-[580px] sm:max-w-[680px] select-none will-change-transform"
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

          {/* RIGHT: Ultra-Premium Modern Minimalist Project Info */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-6 relative min-h-[300px] sm:min-h-[360px] py-4">
            {projects.map((project, index) => {
              const offset = index - progressRef.current;

              if (Math.abs(index - renderIndex) > 1) return null;

              // GSAP / Scroll progress based sync transformations for text elements
              const slideStyle = textSlideStyle(offset);

              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    textSlidesRef.current[index] = el;
                  }}
                  style={{
                    ...slideStyle,
                  }}
                  className="absolute inset-0 flex flex-col justify-center gap-6 py-2 px-2 will-change-transform"
                >
                  <div className="space-y-4">

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-tech text-white tracking-tight leading-[1.05]">
                      {tl(project.title)}
                    </h3>

                    <p className="text-white/60 text-xs sm:text-sm lg:text-base leading-relaxed font-light max-w-md pt-1">
                      {tl(project.description)}
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

                  {/* Premium Preview Button (Rendered conditionally if show_preview is true or undefined) */}
                  {(project.show_preview ?? true) && (
                    <div className="pt-2">
                      <Button
                        onClick={() => setPreviewProject(project)}
                        variant="primary"
                        size="lg"
                        icon={ExternalLink}
                      >
                        {t('featured.preview')}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM BAR ” "More Projects" appears prominently when finished  */}
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
            {t('featured.more')}
          </Button>
        </div>

      </section>

      {/* Render ProjectPreviewModal under section */}
      <ProjectPreviewModal
        isOpen={Boolean(previewProject)}
        onClose={() => setPreviewProject(null)}
        project={previewProject}
        onOpenContact={onOpenContact}
      />
    </div>
  );
}
