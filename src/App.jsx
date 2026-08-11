import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProjectShowcase from './components/ProjectShowcase';
import HowIWork from './components/HowIWork';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import AudioPlayer from './components/AudioPlayer';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [startAudio, setStartAudio] = useState(false);

  useEffect(() => {
    // Initialize Lenis smooth scroll engine synchronized with GSAP ScrollTrigger
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
      
      {/* High-End Futuristic Loading Screen */}
      {isLoading && (
        <Preloader
          onComplete={() => {
            setIsLoading(false);
            setStartAudio(true);
          }}
        />
      )}

      {/* Floating Ambient Audio Player with Auto-Play Trigger */}
      <AudioPlayer autoPlayTrigger={startAudio} />

      {/* Fixed Glass Navbar */}
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <main>
        {/* Hero Section */}
        <Hero onOpenContact={() => setIsContactOpen(true)} />

        {/* About Me Section */}
        <About />

        {/* Featured Work / Interactive Holographic 3D Card Showcase */}
        <ProjectShowcase />

        {/* How I Work — From Idea to Launch Process Timeline */}
        <HowIWork onOpenContact={() => setIsContactOpen(true)} />
      </main>

      {/* Footer & Chrome Emblem */}
      <Footer onOpenContact={() => setIsContactOpen(true)} />

      {/* Interactive Contact Popup Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

    </div>
  );
}

