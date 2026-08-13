import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import ProjectShowcase from '../components/sections/ProjectShowcase';
import HowIWork from '../components/sections/HowIWork';
import LetsTalkModal from '../components/common/LetsTalkModal';
import Preloader from '../components/common/Preloader';
import AudioPlayer from '../components/common/AudioPlayer';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage({ isLoading, onPreloaderComplete, startAudio, onNavigateToLab }) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-white selection:text-black">

      {isLoading && <Preloader onComplete={onPreloaderComplete} />}

      <AudioPlayer autoPlayTrigger={startAudio} />

      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <main>
        <Hero onOpenContact={() => setIsContactOpen(true)} />
        <About />
        <ProjectShowcase onNavigateToProjects={onNavigateToLab} />
        <HowIWork onOpenContact={() => setIsContactOpen(true)} />
      </main>

      <Footer onOpenContact={() => setIsContactOpen(true)} />

      <LetsTalkModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}