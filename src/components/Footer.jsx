import React from 'react';
import { ArrowUp, Heart, Globe, Sparkles } from 'lucide-react';

export default function Footer({ onOpenContact }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#06070c] border-t border-white/10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Bottom Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-t from-purple-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Main Footer Centerpiece */}
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Chrome Monogram Emblem */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-cyan-400 to-pink-500 p-[2px] shadow-2xl shadow-purple-500/30 group hover:scale-105 transition-transform duration-500">
            <div className="w-full h-full bg-[#0a0c16] rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/assets/chrome-logo.jpg"
                alt="Chrome Emblem Logo"
                className="w-full h-full object-cover filter brightness-110 contrast-125"
              />
            </div>
          </div>

          <div>
            <h3 className="font-heading font-black text-4xl sm:text-5xl text-white tracking-widest uppercase">
              EXTIZ
            </h3>
            <p className="font-mono text-xs text-purple-400 tracking-widest uppercase mt-2">
              DESIGNED FOR DIGITAL EXPERIENCES • AVAILABLE FOR FREELANCE & CONTRACT WORK
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={onOpenContact}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs tracking-widest uppercase shadow-lg shadow-purple-500/25 hover:scale-105 transition-all"
            >
              GET IN TOUCH
            </button>
          </div>
        </div>

        {/* Navigation & Social Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-white/10 text-xs font-mono text-slate-400">
          
          <div>
            © 2026 EXTIZ STUDIO. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
            <a href="#work" className="hover:text-white transition-colors">WORK</a>
            <a href="#services" className="hover:text-white transition-colors">SERVICES</a>
            <button onClick={onOpenContact} className="hover:text-purple-400 transition-colors">CONTACT</button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 p-2.5 rounded-full glass-panel border border-white/10 hover:border-purple-500/50 hover:text-white transition-all"
            title="Back to Top"
          >
            <span className="text-[10px] tracking-wider uppercase">BACK TO TOP</span>
            <ArrowUp className="w-4 h-4 text-purple-400" />
          </button>
        </div>

      </div>
    </footer>
  );
}
