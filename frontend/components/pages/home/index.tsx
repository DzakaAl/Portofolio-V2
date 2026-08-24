'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from './partials/Hero';
import About from './partials/About';
import ProjectShowcase from './partials/Featured';
import HowIWork from './partials/HowIWork';
import LetsTalkModal from './partials/LetsTalk';
import AudioPlayer from './partials/AudioPlayer';
import Preloader from '../preloader';
import { getFeaturedProjects, getAbout, getTechStacks, getMessages } from '@/lib/api';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const router = useRouter();
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Preloader & audio state (dipindah dari App.jsx lama, aman untuk prerender)
  const [isLoading, setIsLoading] = useState(true);
  const [startAudio, setStartAudio] = useState(false);

  useEffect(() => {
    const hasPreloaded = sessionStorage.getItem('has_preloaded');
    if (hasPreloaded) {
      setIsLoading(false);
      setStartAudio(true);
    }

    // Scroll ke hash target jika datang dari halaman lain
    const targetHash = sessionStorage.getItem('scroll_to_hash');
    if (targetHash) {
      sessionStorage.removeItem('scroll_to_hash');
      setTimeout(() => {
        const targetElement = document.querySelector(targetHash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, []);

  // Inisialisasi seluruh API Promises database untuk dipantau dan ditunggu oleh Preloader
  // (hanya di client — hindari panggilan API saat prerender/build)
  const apiPromises = useMemo<Promise<unknown>[]>(() => {
    if (typeof window === 'undefined') return [];
    return [getFeaturedProjects(), getAbout(), getTechStacks(), getMessages()];
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('has_preloaded', 'true');
    setIsLoading(false);
    setStartAudio(true);
  };

  const navigateToLab = () => {
    router.push('/lab');
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-white selection:text-black">

      {isLoading && (
        <Preloader
          onComplete={handlePreloaderComplete}
          apiPromises={apiPromises}
        />
      )}


      <AudioPlayer autoPlayTrigger={startAudio} />

      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <main>
        <Hero isLoading={isLoading} onOpenContact={() => setIsContactOpen(true)} />
        <About />
        <ProjectShowcase
          onNavigateToProjects={navigateToLab}
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
