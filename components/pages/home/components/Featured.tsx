'use client';
import { SectionDecor } from '@/components/ui/Decor';
import SectionHeading from '@/components/ui/SectionHeading';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFeaturedProjects } from '@/lib/api';
import ProjectPreviewModal from '@/components/ui/ProjectPreviewModal';
import { useLanguage } from '@/lib/i18n';
import type { Project } from '@/lib/types';

interface ProjectShowcaseProps {
  onNavigateToProjects?: () => void;
  onOpenContact?: () => void;
}

export default function ProjectShowcase({ onNavigateToProjects, onOpenContact }: ProjectShowcaseProps) {
  const { t, tl } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

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
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.fw-panel').forEach((el) => {
        const media = el.querySelector('.fw-media');
        const img = el.querySelector('.fw-media img');
        const text = el.querySelectorAll('.fw-text > *');
        const even = el.classList.contains('fw-even');
        const dir = even ? 1 : -1;
        // dramatic scrubbed entrance: clip reveal + tilt + zoom, tied to scroll
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 95%', end: 'center 55%', scrub: 1 } })
          .fromTo(media,
            { clipPath: 'inset(18% 30% 18% 30% round 40px)', rotate: dir * -8, x: dir * 160, y: 120, scale: 0.75 },
            { clipPath: 'inset(0% 0% 0% 0% round 16px)', rotate: 0, x: 0, y: 0, scale: 1, ease: 'power2.out' }, 0)
          .fromTo(img, { scale: 1.5 }, { scale: 1, ease: 'power2.out' }, 0)
          .fromTo(text, { opacity: 0, x: dir * -120, skewX: dir * 10 }, { opacity: 1, x: 0, skewX: 0, stagger: 0.08, ease: 'power3.out' }, 0.1);
        // exit: drift away while scrolling past
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'center 35%', end: 'bottom top', scrub: 1 } })
          .to(media, { y: -120, rotate: dir * 4, scale: 0.9, opacity: 0.3, ease: 'none' }, 0)
          .to(el.querySelector('.fw-text'), { y: -80, opacity: 0, ease: 'none' }, 0);
      });
      gsap.fromTo('.fw-more', { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.fw-more', start: 'top 90%' } });
      gsap.fromTo('.fw-head > p, .fw-head > h2', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.fw-head', start: 'top 80%' } });
      gsap.fromTo('.fw-head .sec-line', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.fw-head', start: 'top 80%' } });
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, [projects.length]);

    return (
    <section ref={sectionRef} id="work" className="relative select-none">
      {/* section heading */}
      <SectionHeading className="fw-head mx-auto w-full max-w-[1600px] px-5 pt-28 sm:px-10 lg:px-14" title={t('featured.title')} />
      {projects.map((project, i) => {
        const even = i % 2 === 1;
        return (
          <div
            key={project.id}
            className={`fw-panel ${even ? 'fw-even' : ''} relative isolate flex min-h-screen items-center overflow-hidden`}
          >
            <SectionDecor side={even ? 'left' : 'right'} hairline={false} />

            <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-10 px-5 py-28 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:px-14">
              <div className={`fw-media overflow-hidden rounded-2xl ${even ? 'lg:order-2' : ''}`}>
                <img
                  src={project.image}
                  alt={tl(project.title)}
                  className="w-full aspect-[16/10] object-cover transition-transform duration-700 hover:scale-[1.04]"
                />
              </div>
              <div className="fw-text">
                <h3 className="font-tech text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {tl(project.title)}
                </h3>
                <div className="mt-5 font-mono text-sm tracking-wider text-slate-400">
                  {project.tags.join('  ·  ')}
                </div>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 lg:text-lg">
                  {tl(project.description)}
                </p>
                {(project.show_preview ?? true) && (
                  <div className="mt-9">
                    <button
                      onClick={() => setPreviewProject(project)}
                      className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all hover:scale-[1.03] hover:bg-sky-300 cursor-pointer sm:w-auto"
                    >
                      {t('featured.preview')}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* more projects */}
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-28 sm:px-10 lg:px-14">
        <div className="fw-more flex items-center gap-6">
          <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-sky-400 sm:block" />
          <button
            onClick={onNavigateToProjects}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-7 py-3.5 font-mono text-xs uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black cursor-pointer sm:w-auto"
          >
            {t('featured.more')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <ProjectPreviewModal
        isOpen={Boolean(previewProject)}
        onClose={() => setPreviewProject(null)}
        project={previewProject}
        onOpenContact={onOpenContact}
      />
    </section>
  );
}
