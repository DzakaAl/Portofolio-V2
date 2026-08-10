import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarqueeBanner from './components/MarqueeBanner';
import About from './components/About';
import ProjectShowcase from './components/ProjectShowcase';
import Services from './components/Services';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-white selection:text-black">
      
      {/* Fixed Glass Navbar */}
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <main>
        {/* Hero Section */}
        <Hero onOpenContact={() => setIsContactOpen(true)} />

        {/* Scrolling Ticker Ribbon 1 */}
        <MarqueeBanner />

        {/* About Me Section */}
        <About />

        {/* Scrolling Ticker Ribbon 2 */}
        <MarqueeBanner />

        {/* Featured Work / Interactive Holographic 3D Card Showcase */}
        <ProjectShowcase />

        {/* Services & Capabilities Matrix */}
        <Services onOpenContact={() => setIsContactOpen(true)} />
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
