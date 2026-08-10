import React from 'react';
import { ExternalLink, Award, Code, Briefcase, Zap, Globe, MessageSquare } from 'lucide-react';

export default function About() {
  const stats = [
    { label: "YEARS EXPERIENCE", value: "08+", icon: Briefcase },
    { label: "PROJECTS COMPLETED", value: "45+", icon: Code },
    { label: "DESIGN AWARDS", value: "12", icon: Award },
    { label: "GLOBAL CLIENTS", value: "28+", icon: Zap },
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Bio Column */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-white"></span>
              <span className="font-mono text-xs uppercase tracking-widest text-white/70">BIOGRAPHY</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight">
              ABOUT ME
            </h2>
          </div>

          <div className="space-y-4 text-slate-300 text-base leading-relaxed font-normal">
            <p>
              I am a Lead Creative Technologist & Full-Stack Architect with over 8 years of experience building high-impact web applications, immersive 3D interfaces, and decentralized financial platforms.
            </p>
            <p>
              My design philosophy bridges high-end visual aesthetics with uncompromising code quality. From high-performance React architectures to bespoke WebGL motion graphics, I turn ambitious visions into seamless digital products.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 pt-2">
            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-white/50 hover:scale-110 transition-all"
              title="GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-white/50 hover:scale-110 transition-all"
              title="LinkedIn"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/></svg>
            </a>
            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-white/50 hover:scale-110 transition-all"
              title="Twitter"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* Dribbble */}
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-white/50 hover:scale-110 transition-all"
              title="Dribbble"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>

          {/* Stats Counter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div key={idx} className="glass-card p-4 rounded-xl border border-white/5 hover:border-white/30 transition-all">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <IconComp className="w-4 h-4" />
                    <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">{stat.value}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Portrait Column */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group max-w-md w-full">
            
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-white/25 to-white/10 rounded-2xl blur-xl opacity-40 group-hover:opacity-75 transition duration-500" />

            {/* Main Portrait Frame */}
            <div className="relative rounded-2xl overflow-hidden glass-panel border border-white/15 p-2 bg-[#0a0a0a]">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <img
                  src="/assets/portrait.jpg"
                  alt="Creator Monochromatic Portrait"
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-heading text-sm font-bold text-white uppercase">EXTIZ / ALEX R.</h4>
                    <p className="text-xs text-white/60 font-mono">CREATIVE DIRECTOR</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
