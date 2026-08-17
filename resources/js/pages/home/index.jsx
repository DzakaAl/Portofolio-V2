import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Hero from './partials/Hero';
import About from './partials/About';
import ProjectShowcase from './partials/Featured';
import HowIWork from './partials/HowIWork';
import LetsTalkModal from './partials/LetsTalk';
import AudioPlayer from './partials/AudioPlayer';
import Preloader from '../preloader';
import { getFeaturedProjects } from '../../api';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage({ isLoading, onPreloaderComplete, startAudio, onNavigateToLab }) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Inisialisasi API promise sekali untuk dipantau oleh Preloader
  const apiPromises = useMemo(() => [getFeaturedProjects()], []);

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

      {isLoading && (
        <Preloader
          onComplete={onPreloaderComplete}
          apiPromises={apiPromises}
        />
      )}


      <AudioPlayer autoPlayTrigger={startAudio} />

      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <main>
        <Hero isLoading={isLoading} onOpenContact={() => setIsContactOpen(true)} />
        <About />
        <ProjectShowcase
          onNavigateToProjects={onNavigateToLab}
          onOpenContact={() => setIsContactOpen(true)}
        />
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