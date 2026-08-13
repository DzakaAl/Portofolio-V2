import React, { useRef, useEffect } from 'react';
import LogoLoop from '../ui/LogoLoop';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portraitImg from '../../assets/portrait.jpeg';

export default function About() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const photoRef = useRef(null);
  const logoLoopRef = useRef(null);

  const techStack = [
    { title: "HTML5", alt: "HTML5", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { title: "CSS3", alt: "CSS3", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { title: "JavaScript", alt: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { title: "PHP", alt: "PHP", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
    { title: "Python", alt: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { title: "Tailwind CSS", alt: "Tailwind CSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { title: "Bootstrap", alt: "Bootstrap", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
    { title: "MySQL", alt: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { title: "React", alt: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { title: "Laravel", alt: "Laravel", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
    { title: "Git", alt: "Git", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { title: "GitHub", alt: "GitHub", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { title: "Figma", alt: "Figma", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { title: "Pandas", alt: "Pandas", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
    { title: "TensorFlow", alt: "TensorFlow", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Title reveal animation
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

      // 2. Text paragraph slide-up reveal
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

      // 3. Card photo 3D perspective reveal
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

      // 4. Logo loop fade-in reveal
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
      {/* Subtle Glow background highlight */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center z-10 my-auto py-8">
        
        {/* Left Section: Single Paragraph explaining about me */}
        <div className="lg:col-span-7 space-y-6">
          <h2 ref={titleRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold font-tech text-white tracking-tight mb-6">
            ABOUT ME
          </h2>

          <div ref={textRef} className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed text-left font-normal">
            <p>
              I am a Lead Creative Technologist & Full-Stack Architect with over 8 years of experience building high-impact digital solutions, scalable web systems, and modern interactive user experiences. My focus lies in unifying minimalist design aesthetics with robust software engineering practices to solve complex real-world problems. Throughout my journey, I have engineered diverse software applications ranging from responsive enterprise web platforms and data-driven dashboards to machine learning models and high-performance backend API services.
            </p>
          </div>
        </div>

        {/* Right Section: Card photo without frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div ref={photoRef} className="max-w-md w-full">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={portraitImg}
                alt="Creator Monochromatic Portrait"
                className="w-full aspect-[3/4] object-cover filter grayscale contrast-110 block"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Monochrome Large Logo Loop embedded inside About me */}
      <div ref={logoLoopRef} className="w-full z-10 select-none pt-4">
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
      </div>

    </section>
  );
}







