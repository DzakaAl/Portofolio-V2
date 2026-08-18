import React, { useRef, useEffect, useState } from 'react';
import LogoLoop from '../../../components/ui/LogoLoop';
import { gsap } from 'gsap';
import portraitImg from '../../../assets/portrait.webp';
import { getAbout, getTechStacks } from '../../../api';

export default function About() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const photoRef = useRef(null);
  const logoLoopRef = useRef(null);

  const [aboutData, setAboutData] = useState({
    title: 'ABOUT ME',
    description: '',
    image_url: null,
  });

  const [techStack, setTechStack] = useState([]);

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
      className="relative min-h-screen flex flex-col justify-between py-20 px-5 sm:px-10 lg:px-14 max-w-[1600px] mx-auto overflow-hidden select-none"
    >
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center z-10 my-auto py-8">
        <div className="lg:col-span-7 space-y-6">
          <h2 ref={titleRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold font-tech text-white tracking-tight mb-6 uppercase">
            ABOUT ME
          </h2>

          <div ref={textRef} className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed text-left font-normal">
            <p className="whitespace-pre-line">{aboutData.description}</p>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div ref={photoRef} className="max-w-md w-full">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={aboutData.image_url || portraitImg}
                alt="Creator Portrait"
                className="w-full aspect-[3/4] object-cover filter grayscale contrast-110 block"
              />
            </div>
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
