'use client';
import { SectionDecor } from '@/components/ui/Decor';
import SectionHeading from '@/components/ui/SectionHeading';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getExperiences } from '@/lib/api';
import { useLanguage } from '@/lib/i18n';

type Entry = { period: string; role: string; org: string; desc: string };

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const { t, tl } = useLanguage();

  useEffect(() => {
    getExperiences().then((data) => {
      {
        setEntries(data.map((e) => ({ period: e.period, role: e.role, org: e.org, desc: e.description })));
      }
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.xp-head', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' } });
      gsap.from('.xp-track', { scaleY: 0, transformOrigin: 'top', duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: '.xp-list', start: 'top 80%' } });
      // progress line fills with scroll; glowing dot rides its tip
      gsap.fromTo('.xp-fill', { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: '.xp-list', start: 'top 60%', end: 'bottom 60%', scrub: 0.6 } });
      gsap.fromTo('.xp-comet', { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: { trigger: '.xp-list', start: 'top 60%', end: 'bottom 60%', scrub: 0.6 } });
      gsap.utils.toArray<HTMLElement>('.xp-entry').forEach((el) => {
        const card = el.querySelector('.xp-card');
        const period = el.querySelector('.xp-period');
        const node = el.querySelector('.xp-node');
        const fromLeft = el.classList.contains('is-left');
        gsap.from(card, { x: fromLeft ? -70 : 70, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } });
        gsap.from(period, { x: fromLeft ? 40 : -40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.1, scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } });
        gsap.from(node, { scale: 0, opacity: 0, rotate: -180, duration: 0.7, ease: 'back.out(2)', delay: 0.15, scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } });
        gsap.from(el.querySelector('.xp-link'), { scaleX: 0, duration: 0.7, ease: 'power3.out', delay: 0.25, scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } });
        // light the node up once the progress line reaches it
        ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 60%', toggleClass: { targets: el, className: 'is-active' } });
      });
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, [entries.length]);

  if (entries.length === 0) return null;

  return (
    <section ref={sectionRef} id="experience" className="relative isolate mx-auto flex min-h-screen max-w-[1600px] flex-col justify-center overflow-hidden px-5 py-28 sm:px-10 lg:px-14">
      <SectionDecor side="right" />
      <SectionHeading className="xp-head relative mb-16" title={t('experience.title')} />

      <div className="xp-list relative mx-auto max-w-[1100px]">
        <style>{`
          @keyframes xp-pulse { 0% { transform: scale(1); opacity: .6; } 100% { transform: scale(2.6); opacity: 0; } }
          @keyframes xp-dash { to { background-position: 0 24px; } }
          .xp-entry .xp-ring { opacity: 0; }
          .xp-entry.is-active .xp-ring { opacity: 1; animation: xp-pulse 1.6s ease-out infinite; }
          .xp-entry.is-active .xp-dot { background: #38bdf8; box-shadow: 0 0 18px 4px rgba(56,189,248,.55); }
          .xp-entry.is-active .xp-link { background: linear-gradient(var(--xp-dir, 90deg), #38bdf8, transparent); }
          .xp-track { background-image: repeating-linear-gradient(to bottom, rgba(255,255,255,.18) 0 8px, transparent 8px 12px); animation: xp-dash 1.2s linear infinite; }
          @media (prefers-reduced-motion: reduce) { .xp-ring, .xp-track { animation: none !important; } }
        `}</style>
        {/* center line: dashed track + scroll-filled progress + travelling comet */}
        <span className="xp-track pointer-events-none absolute left-[13px] top-1 bottom-1 w-[2px] -translate-x-1/2 lg:left-1/2" />
        <span className="xp-fill pointer-events-none absolute left-[13px] top-1 bottom-1 w-[2px] -translate-x-1/2 bg-gradient-to-b from-sky-400 via-sky-400 to-indigo-400 shadow-[0_0_12px_rgba(56,189,248,0.6)] lg:left-1/2" />
        <span className="pointer-events-none absolute left-[13px] top-1 bottom-1 lg:left-1/2">
          <span className="xp-comet absolute left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_20px_6px_rgba(56,189,248,0.7)]" />
        </span>

        <div className="flex flex-col gap-2">
          {entries.map((e, i) => {
            const left = i % 2 === 0;
            return (
              <div
                key={i}
                className={`xp-entry group ${left ? 'is-left' : ''} grid grid-cols-[28px_1fr] items-center gap-x-5 gap-y-3 py-6 lg:grid-cols-[1fr_64px_1fr] lg:gap-0 lg:py-7`}
              >
                {/* node */}
                <div className="xp-node relative z-10 col-start-1 row-start-1 flex justify-center lg:col-start-2">
                  <span className="relative flex h-4 w-4">
                    <span className="xp-ring absolute inset-0 rounded-full bg-sky-400/60" />
                    <span className="xp-dot relative h-4 w-4 rotate-45 rounded-[3px] border-2 border-sky-400 bg-black transition-all duration-500" />
                  </span>
                  {/* connector line from node toward the content */}
                  <span
                    className={`xp-link absolute top-1/2 hidden h-px w-10 -translate-y-1/2 bg-white/20 transition-colors duration-500 lg:block ${left ? 'right-1/2 mr-2 origin-right' : 'left-1/2 ml-2 origin-left'}`}
                    style={{ '--xp-dir': left ? '270deg' : '90deg' } as React.CSSProperties}
                  />
                </div>

                {/* content (flat, no card) */}
                <div
                  className={`xp-card transition-transform duration-500 group-hover:-translate-y-1 col-start-2 row-start-1 ${
                    left ? 'lg:col-start-1 lg:pr-12 lg:text-right' : 'lg:col-start-3 lg:pl-12'
                  }`}
                >
                  <div className="font-mono text-xs font-medium tracking-[0.14em] text-sky-400">{tl(e.period)}</div>
                  <h3 className="mt-3 font-tech text-xl font-semibold tracking-tight text-white sm:text-2xl">{tl(e.role)}</h3>
                  <div className="mt-1 font-mono text-xs text-slate-400">{tl(e.org)}</div>
                  <p className="mt-3 text-[14px] leading-relaxed text-slate-400">{tl(e.desc)}</p>
                </div>

                {/* big faint period on opposite side (desktop) */}
                <div
                  className={`xp-period hidden row-start-1 select-none lg:block ${
                    left ? 'lg:col-start-3 lg:pl-14 lg:text-left' : 'lg:col-start-1 lg:pr-14 lg:text-right'
                  }`}
                >
                  <div className="font-tech text-[90px] font-bold leading-none text-white/10 transition-colors duration-300 group-hover:text-sky-400/30 xl:text-[128px]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
