import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowUpRight, Code2 } from 'lucide-react';

export default function Navbar({ onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${
          scrolled ? 'glass-panel shadow-2xl border border-white/10' : 'bg-transparent'
        }`}>
          
          {/* Logo / Brand Monogram */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-[1px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d0f17] rounded-full flex items-center justify-center overflow-hidden">
                <img src="/assets/chrome-logo.jpg" alt="EXTIZ Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg tracking-wider text-white group-hover:text-purple-400 transition-colors">
                EXTIZ
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
                STUDIO 2026
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <a href="#about" className="text-slate-300 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-purple-500 after:to-cyan-400 hover:after:w-full after:transition-all">
              ABOUT ME
            </a>
            <a href="#work" className="text-slate-300 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-purple-500 after:to-cyan-400 hover:after:w-full after:transition-all">
              FEATURED WORK
            </a>
            <a href="#services" className="text-slate-300 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-purple-500 after:to-cyan-400 hover:after:w-full after:transition-all">
              SERVICES
            </a>
          </nav>

          {/* CTA Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenContact}
              className="relative group overflow-hidden rounded-full p-[1px] font-semibold text-sm transition-transform active:scale-95"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 rounded-full animate-pulse"></span>
              <span className="relative flex items-center gap-2 px-5 py-2.5 bg-[#0b0d14] rounded-full text-white group-hover:bg-opacity-80 transition-all">
                <span>LET'S TALK</span>
                <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-purple-400 font-medium tracking-wider text-sm py-2"
            >
              ABOUT ME
            </a>
            <a
              href="#work"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-purple-400 font-medium tracking-wider text-sm py-2"
            >
              FEATURED WORK
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-purple-400 font-medium tracking-wider text-sm py-2"
            >
              SERVICES
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl text-white font-semibold text-sm mt-2"
            >
              <span>LET'S TALK</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
