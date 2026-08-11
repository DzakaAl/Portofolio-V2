import React from 'react';
import { ArrowUp, Heart, Globe, Sparkles } from 'lucide-react';

export default function Footer({ onOpenContact }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black border-t border-white/10 pt-20 pb-12 px-5 sm:px-10 lg:px-14 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* Bottom Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-t from-white/10 via-white/5 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full space-y-16 relative z-10">
        
        {/* Main Footer Centerpiece */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
          
          {/* Soft Sky Blue Text Logo: DzakaAl with Love Light Font */}
          <div className="py-2 flex items-center gap-3">
            <span className="font-lovelight text-sky-400 text-5xl sm:text-6xl font-semibold leading-none drop-shadow-[0_2px_12px_rgba(56,189,248,0.4)] inline-block hover:scale-105 transition-transform duration-300">
              DzakaAl
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-tech font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-none uppercase">
              HAVE AN IDEA?
            </h3>
            <p className="font-mono text-xs text-white/50 tracking-widest uppercase pt-2">
              AVAILABLE FOR FREELANCE PROJECTS & FULL-TIME CONTRACTS
            </p>
          </div>

          <div className="pt-3">
            <button
              onClick={onOpenContact}
              className="px-9 py-4 rounded-full bg-white text-black font-extrabold text-xs tracking-[0.15em] uppercase shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_45px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300"
            >
              GET IN TOUCH
            </button>
          </div>
        </div>

        {/* Navigation & Social Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-white/10 text-xs font-mono text-slate-400">
          
          <div>
            © 2026 DZAKAAL STUDIO. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-white transition-colors">ABOUT ME</a>
            <a href="#work" className="hover:text-white transition-colors">FEATURED WORK</a>
            <a href="#process" className="hover:text-white transition-colors">HOW I WORK</a>
            <button onClick={onOpenContact} className="hover:text-white transition-colors">CONTACT</button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 p-2.5 rounded-full glass-panel border border-white/10 hover:border-white/50 hover:text-white transition-all"
            title="Back to Top"
          >
            <span className="text-[10px] tracking-wider uppercase">BACK TO TOP</span>
            <ArrowUp className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </footer>
  );
}
