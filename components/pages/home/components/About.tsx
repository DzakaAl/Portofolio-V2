'use client';
import { SECTION_TITLE, SECTION_LINE } from '@/components/ui/SectionHeading';
import React, { useRef, useEffect, useState } from 'react';
import LogoLoop from '@/components/home/LogoLoop';
import { gsap } from 'gsap';
import { useLanguage } from '@/lib/i18n';
const portraitImg = '/assets/portrait.webp';
import { getAbout, getTechStacks } from '@/lib/api';
import type { AboutData, TechStack } from '@/lib/types';

export default function About() {
  const { t, tl } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const logoLoopRef = useRef<HTMLDivElement>(null);

  const [aboutData, setAboutData] = useState<AboutData>({
    description: '',
    image_url: null,
  });

  const [techStack, setTechStack] = useState<TechStack[]>([]);

  useEffect(() => {
    getAbout().then((data) => {
      if (data) setAboutData(data);
    });

    getTechStacks().then((stacks) => {
      if (stacks && stacks.length > 0) setTechStack(stacks);
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: -100, filter: 'blur(10px)' },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 70, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        photoRef.current,
        { opacity: 0, scale: 0.75, rotationY: 35, y: 50 },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        logoLoopRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative isolate bg-black min-h-screen flex flex-col justify-between py-20 px-5 sm:px-10 lg:px-14 max-w-[1600px] mx-auto overflow-hidden select-none"
    >

      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center z-10 my-auto py-8">
        <div className="lg:col-span-7">
          <h2 ref={titleRef} className={SECTION_TITLE}>{t('about.title')}</h2>
          <span className={SECTION_LINE} />
          <p className="mt-8 font-tech text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
            {t('about.tagline')}
          </p>

          <div ref={textRef} className="mt-7 space-y-4 text-slate-400 text-base sm:text-lg leading-relaxed max-w-[58ch] font-normal">
            {aboutData.description ? (
              <p className="whitespace-pre-line">{tl(aboutData.description)}</p>
            ) : (
              <div className="space-y-3" aria-hidden="true">
                <div className="h-4 w-full rounded bg-white/[0.06] animate-pulse" />
                <div className="h-4 w-11/12 rounded bg-white/[0.06] animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-white/[0.06] animate-pulse" />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div ref={photoRef} className="relative w-full max-w-[420px] aspect-[4/5]">
            <img
              src={aboutData.image_url || portraitImg}
              alt="Creator Portrait"
              className="w-full h-full object-cover"
              style={{
                filter: 'grayscale(1) contrast(1.06) brightness(0.92)',
                WebkitMaskImage:
                  'radial-gradient(130% 115% at 62% 38%, #000 46%, rgba(0,0,0,0.35) 72%, transparent 100%)',
                maskImage:
                  'radial-gradient(130% 115% at 62% 38%, #000 46%, rgba(0,0,0,0.35) 72%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </div>

      <div ref={logoLoopRef} className="w-full z-10 select-none pt-4">
        {techStack.length > 0 && (
          <LogoLoop
            logos={techStack}
            speed={90}
            direction="left"
            logoHeight={56}
            gap={56}
            fadeOut={true}
            fadeOutColor="#000000"
            pauseOnHover={false}
            scaleOnHover={false}
          />
        )}
      </div>
    </section>
  );
}
