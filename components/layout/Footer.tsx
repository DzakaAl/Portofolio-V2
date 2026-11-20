'use client';
import { FooterDecor } from '@/components/ui/Decor';
import React, { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/i18n';

interface FooterProps {
  onOpenContact?: () => void;
}

export default function Footer({ onOpenContact }: FooterProps) {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.ft-rise', {
        y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      });
      gsap.from('.ft-word', {
        y: 60, opacity: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const social = [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Email', href: 'mailto:contact@dzakaal.com' },
  ];

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-white/10 bg-black">
      <FooterDecor />

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 sm:px-10 lg:px-14">
        {/* Bottom bar */}
        <div className="ft-rise flex flex-col gap-6 pt-20 pb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 font-mono text-xs uppercase tracking-[0.1em] text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">{t('nav.about')}</a>
            <a href="#work" className="hover:text-white transition-colors">{t('nav.work')}</a>
            <a href="#experience" className="hover:text-white transition-colors">{t('nav.experience')}</a>
            <a href="#process" className="hover:text-white transition-colors">{t('nav.process')}</a>
            <button onClick={onOpenContact} className="uppercase hover:text-white transition-colors cursor-pointer">
              {t('footer.contact')}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-slate-300 transition-all hover:border-sky-400 hover:text-white"
              >
                {s.label}
              </a>
            ))}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-slate-300 transition-all hover:border-sky-400 hover:text-white"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 py-6 text-center font-mono text-[11px] text-slate-600">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
