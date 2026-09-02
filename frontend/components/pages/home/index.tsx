'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from './components/Hero';
import About from './components/About';
import ProjectShowcase from './components/Featured';
import HowIWork from './components/HowIWork';
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

  // Preloader & audio state (dipindah dari App.jsx lama, aman untuk prerender)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasPreloaded = sessionStorage.getItem('has_preloaded');
    if (hasPreloaded) {
      setIsLoading(false);
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
    // Auto-play musik dipicu hanya di awal (setelah preloader selesai;
    // AudioPlayer global di layout mendengarkan event ini..
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('start-portfolio-audio'));
    }
  };

  const navigateToProject = () => {
    router.push('/project');
  };

  const navigateToContact = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-white selection:text-black">

      {isLoading && (
        <Preloader
          onComplete={handlePreloaderComplete}
          apiPromises={apiPromises}
        />
      )}


      <Navbar />

      <main>
        <Hero isLoading={isLoading} onOpenContact={navigateToContact} />
        <About />
        <ProjectShowcase
          onNavigateToProjects={navigateToProject}
          onOpenContact={navigateToContact}
        />
        <HowIWork onOpenContact={navigateToContact} />
      </main>

      <Footer onOpenContact={navigateToContact} />
    </div>
  );
}
