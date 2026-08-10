import React from 'react';
import { Sparkles, Compass, ShieldCheck, Cpu, ArrowDown } from 'lucide-react';

export default function Hero({ onOpenContact }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-28 pb-16 px-4 overflow-hidden bg-ambient-grid">
      
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyber Badges Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mb-8">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-purple-500/30 text-xs font-mono text-purple-300 shadow-lg shadow-purple-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>PORTFOLIO // 2026 EDITION</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-500/10">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>FULLSTACK & WEB3 ARCHITECT</span>
        </div>
      </div>

      {/* Main Hero Headline */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.95] mb-6 select-none">
          <span className="block font-heading text-slate-100 uppercase drop-shadow-md">
            TAKE
          </span>
          <span className="block font-display animated-metallic tracking-wider uppercase text-glow-purple my-2">
            CREATIVITY
          </span>
          <span className="block font-heading text-slate-100 uppercase tracking-widest text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
            FURTHER
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 font-normal leading-relaxed mb-10">
          Crafting next-generation digital experiences, high-performance web applications, and immersive 3D cyberpunk interfaces with cutting-edge engineering.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenContact}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
          >
            START A PROJECT
          </button>
          
          <a
            href="#work"
            className="px-8 py-4 rounded-full glass-card text-slate-200 hover:text-white font-bold text-sm tracking-wider uppercase border border-white/10 hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300"
          >
            EXPLORE WORK
          </a>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">SCROLL</span>
        <div className="w-6 h-10 rounded-full border-2 border-slate-500/40 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-purple-400 rounded-full animate-bounce mt-1" />
        </div>
      </div>
    </section>
  );
}
