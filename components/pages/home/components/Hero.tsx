'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { HeroDecor } from '@/components/ui/Decor';
import { getFeaturedProjects } from '@/lib/api';
import { useLanguage } from '@/lib/i18n';
import type { Project } from '@/lib/types';

interface HeroProps {
  onOpenContact?: () => void;
  isLoading?: boolean;
}

// Stacked-card transforms (center front, two behind peeking up-left / up-right).
const CARD_POS = [
  'translate(-50%,-50%) translateY(16px)',
  'translate(-50%,-50%) translate(-80px,-48px) rotate(-6deg) scale(.95)',
  'translate(-50%,-50%) translate(80px,-30px) rotate(6deg) scale(.95)',
];
// Spread positions on hover — fan out so all three are fully visible.
const SPREAD_POS = [
  'translate(-50%,-50%) scale(1.02)',
  'translate(-50%,-50%) translateX(-74%) rotate(-5deg) scale(.9)',
  'translate(-50%,-50%) translateX(74%) rotate(5deg) scale(.9)',
];

export default function Hero({ onOpenContact }: HeroProps) {
  const { tl } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [spread, setSpread] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let mounted = true;
    getFeaturedProjects().then((data) => {
      if (mounted) setProjects(data.slice(0, 3));
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Intro animation once cards are in the DOM.
  useEffect(() => {
    if (projects.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero-card', {
        y: 90,
        opacity: 0,
        scale: 0.9,
        rotateX: 12,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
      });
      gsap.from('.hero-rise', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        delay: 0.3,
        ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [projects.length]);

  const scrollToWork = () => {
    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
  };

  const order = [0, 1, 2];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[94vh] w-full flex-col overflow-hidden px-5 pb-12 pt-28 sm:px-10 lg:px-14 max-w-[1600px] mx-auto select-none"
    >
      <HeroDecor />

      {/* stacked project cards (bigger + more breathing room) */}
      <div
        className="relative z-10 mx-auto mt-6 mb-4 h-[clamp(320px,46vw,540px)] w-full"
        style={{ perspective: '1800px' }}
        onMouseEnter={() => setSpread(true)}
        onMouseLeave={() => setSpread(false)}
      >
        {projects.length === 0 && (
          <div className="absolute left-1/2 top-1/2 aspect-video w-[min(620px,82vw)] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        )}
        {projects.map((project, i) => {
          const pos = order.indexOf(i);
          const z = i === 0 ? 30 : i === 1 ? 10 : 20;
          const bright = i === 0 ? 'brightness-100' : i === 1 ? 'brightness-[0.68]' : 'brightness-[0.8]';
          const transform = spread ? SPREAD_POS[i] ?? SPREAD_POS[0] : CARD_POS[pos] ?? CARD_POS[0];
          return (
            <article
              key={project.id}
              className={`hero-card absolute left-1/2 top-1/2 aspect-video w-[min(560px,78vw)] transition-transform duration-500 ease-out ${
                i === 0 && !spread ? 'animate-[heroFloat_6s_ease-in-out_infinite]' : ''
              }`}
              style={{ transform, zIndex: z }}
            >
              <div
                className={`relative h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_50px_100px_-36px_rgba(0,0,0,0.92)] transition-all duration-500 ${
                  spread ? 'brightness-100 border-sky-400/30' : bright
                }`}
              >
                <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05060e]/90 to-transparent p-5">
                  <h3 className="font-tech text-xl font-semibold text-white">{tl(project.title)}</h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                    {project.tags.slice(0, 3).join(' · ')}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* headline (2 lines, smaller) LEFT + buttons RIGHT */}
      <div className="relative z-20 mt-auto flex flex-col gap-8 pt-10 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="hero-rise m-0 font-tech text-[clamp(27px,3.9vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
          Fullstack &amp; AI engineer
          <br />
          <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            crafting products people enjoy.
          </span>
        </h1>
        <div className="hero-rise flex shrink-0 flex-wrap items-center gap-4">
          <button
            onClick={scrollToWork}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#07080b] transition-all hover:bg-slate-200 hover:scale-[1.03]"
          >
            Explore projects →
          </button>
          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 rounded-full border border-white/70 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-[#07080b]"
          >
            Get in touch ↗
          </button>
        </div>
      </div>
    </section>
  );
}
