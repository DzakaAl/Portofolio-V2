'use client';
import SectionHeading from '@/components/ui/SectionHeading';
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/i18n';

interface HowIWorkProps {
  onOpenContact?: () => void;
}

export default function HowIWork(_: HowIWorkProps = {}) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const phases = [
    { title: t('work.p1.title'), subtitle: t('work.p1.subtitle'), description: t('work.p1.desc') },
    { title: t('work.p2.title'), subtitle: t('work.p2.subtitle'), description: t('work.p2.desc') },
    { title: t('work.p3.title'), subtitle: t('work.p3.subtitle'), description: t('work.p3.desc') },
    { title: t('work.p4.title'), subtitle: t('work.p4.subtitle'), description: t('work.p4.desc') },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.wi-head', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' } });
      gsap.utils.toArray<HTMLElement>('.wi-card').forEach((el, i) => {
        gsap.from(el, { y: 100, opacity: 0, scale: 0.95, duration: 1.1, ease: 'expo.out', delay: i * 0.12, scrollTrigger: { trigger: '.wi-grid', start: 'top 88%', toggleActions: 'play none none none' } });
      });
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="relative isolate mx-auto flex min-h-screen max-w-[1600px] flex-col justify-center overflow-hidden px-5 py-28 sm:px-10 lg:px-14 select-none">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-0 top-1/4 h-[560px] w-[760px] translate-x-1/3 rounded-full bg-sky-500/[0.05] blur-[170px]" />
        <span className="absolute left-2 top-6 font-tech text-[17vw] font-bold leading-none text-transparent opacity-60" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.03)' }}>05</span>
      </div>
      <SectionHeading className="wi-head relative mb-16" title={t('work.title')} />

      <div className="wi-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((p, i) => (
          <div
            key={i}
            className="wi-card group relative border-t border-white/10 pt-8 pr-4"
          >
            {/* top accent line */}
            <span className="absolute left-0 top-0 h-[2px] w-0 bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-500 group-hover:w-full" />
            <div
              className="font-tech text-6xl font-bold leading-none text-transparent transition-colors duration-300 group-hover:text-sky-400"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.16)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-sky-400">
              {t('work.phase')} {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="mt-2 font-tech text-xl font-semibold tracking-tight text-white">{p.title}</h3>
            <div className="mt-1 font-mono text-[11px] text-slate-500">{p.subtitle}</div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
