'use client';
import SectionHeading from '@/components/ui/SectionHeading';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getCertificates } from '@/lib/api';
import { useLanguage } from '@/lib/i18n';

type Cert = { img: string; title: string; issuer: string; year: string; href?: string };

export default function Certificates() {
  const sectionRef = useRef<HTMLElement>(null);
  const [certs, setCerts] = useState<Cert[]>([]);
  const { t, tl } = useLanguage();

  useEffect(() => {
    getCertificates().then((data) => {
      {
        setCerts(data.map((c) => ({ img: c.image, title: c.title, issuer: c.issuer, year: c.year, href: c.link || undefined })));
      }
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.cert-head', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' } });
      gsap.utils.toArray<HTMLElement>('.cert-box').forEach((el, i) => {
        gsap.from(el, { y: 100, opacity: 0, scale: 0.9, duration: 1.1, ease: 'expo.out', delay: i * 0.1, scrollTrigger: { trigger: '.cert-grid', start: 'top 90%', toggleActions: 'play none none none' } });
      });
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, [certs.length]);

  if (certs.length === 0) return null;

  return (
    <section ref={sectionRef} id="certificates" className="relative isolate mx-auto flex min-h-screen max-w-[1600px] flex-col justify-center overflow-hidden px-5 py-28 sm:px-10 lg:px-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.05] blur-[170px]" />
        <span className="absolute right-2 top-6 font-tech text-[17vw] font-bold leading-none text-transparent opacity-60" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.03)' }}>04</span>
      </div>
      <SectionHeading className="cert-head relative mb-16" title={t('certificates.title')} />

      <div className="cert-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {certs.map((c) => (
          <a
            key={tl(c.title)}
            href={c.href || '#'}
            className="cert-box group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400/40 hover:bg-white/[0.04] hover:shadow-[0_30px_60px_-34px_rgba(0,0,0,0.9)]"
          >
            <div className="relative overflow-hidden bg-[#0b0f16]">
              <img src={c.img} alt={`${tl(c.title)} certificate`} className="aspect-[800/560] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
              <div className="absolute inset-0 grid place-items-center bg-[#06080b]/50 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                <span className="border-b border-sky-400 pb-1 font-mono text-[11px] tracking-wide text-white">View credential ↗</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-tech text-base font-semibold leading-snug text-white transition-colors group-hover:text-sky-400">{tl(c.title)}</h3>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="truncate font-mono text-[11px] text-slate-400">{tl(c.issuer)}</span>
                <span className="shrink-0 font-mono text-[11px] text-slate-500">{c.year}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
