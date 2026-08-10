import React from 'react';
import { Terminal, Box, Palette, Gamepad, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function Services({ onOpenContact }) {
  const services = [
    {
      icon: Terminal,
      title: "FULLSTACK & WEB3 ARCHITECTURE",
      subtitle: "High-performance Web Apps & Protocols",
      description: "Building scalable React 19 web applications, decentralized smart contract integrations, and real-time WebSocket state management.",
      deliverables: ["React / Vite SPA", "Smart Contract Hooks", "REST & GraphQL APIs", "Tailwind Design Systems"]
    },
    {
      icon: Box,
      title: "3D WEBGL & MOTION GRAPHICS",
      subtitle: "Immersive Web Experiences",
      description: "Crafting interactive 3D browser graphics, custom GLSL shader effects, and high-framerate Three.js product showcases.",
      deliverables: ["Three.js Shader Effects", "Interactive 3D Cards", "Canvas Particle Engines", "Framer Motion Animations"]
    },
    {
      icon: Palette,
      title: "BRAND IDENTITY & UI/UX SYSTEM",
      subtitle: "Cyberpunk & Modern Dark Aesthetics",
      description: "Designing bespoke digital brand languages, glassmorphism design systems, typography hierarchy, and interactive prototypes.",
      deliverables: ["Design Systems", "Dark Mode UI Kits", "Design Tokens & Styleguides", "Figma Interactive Prototypes"]
    },
    {
      icon: Gamepad,
      title: "GAME UI & CYBERPUNK SYSTEMS",
      subtitle: "HUDs & Gaming Interfaces",
      description: "Architecting futuristic heads-up displays, esports tournament dashboards, gaming overlay UI, and interactive web tools.",
      deliverables: ["Custom HUD Elements", "Esports Dashboards", "Gamified Web Portals", "Real-Time Leaderboards"]
    }
  ];

  return (
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="w-8 h-[2px] bg-white"></span>
          <span className="font-mono text-xs uppercase tracking-widest text-white/70">CAPABILITIES</span>
          <span className="w-8 h-[2px] bg-white"></span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight mb-4">
          SERVICES & EXPERTISE
        </h2>
        <p className="text-slate-400 text-base">
          Delivering end-to-end digital solutions that push visual and technical boundaries.
        </p>
      </div>

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((srv, idx) => {
          const IconComponent = srv.icon;
          return (
            <div
              key={idx}
              className="glass-card p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-white transition-all">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <span className="font-mono text-xs text-slate-500 font-bold tracking-widest">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-2xl text-white tracking-wider mb-2 group-hover:text-white transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs font-mono text-white/60 mb-4 tracking-wider uppercase">
                  {srv.subtitle}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {srv.description}
                </p>
              </div>

              {/* Deliverables List */}
              <div className="pt-6 border-t border-white/10 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-3">KEY DELIVERABLES</div>
                <div className="grid grid-cols-2 gap-2">
                  {srv.deliverables.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Service CTA Footer */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-4 p-4 glass-panel rounded-full border border-white/10">
          <span className="text-xs font-mono text-slate-300 pl-4">HAVE A CUSTOM PROJECT IN MIND?</span>
          <button
            onClick={onOpenContact}
            className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs tracking-wider uppercase hover:scale-105 transition-all"
          >
            LET'S BUILD TOGETHER
          </button>
        </div>
      </div>

    </section>
  );
}
