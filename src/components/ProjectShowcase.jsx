import React, { useState, useRef } from 'react';
import { ExternalLink, ChevronRight, Gamepad2, Layers, Cpu, Flame, Sparkles, Code2 } from 'lucide-react';

export default function ProjectShowcase() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  
  // 3D Card Tilt State
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  const projects = [
    {
      id: 'cyber-arcade',
      title: 'CYBER ARCADE 2099',
      subtitle: 'WebGL Synthwave Fighter Game',
      category: 'GAME DEV / WEBGL',
      description: 'Interactive high-speed synthwave arcade spaceship battle game engine built with React Three Fiber, custom shaders, and spatial audio.',
      tags: ['REACT', 'THREE.JS', 'WEBGL', 'TAILWIND', 'GLSL'],
      image: '/assets/synthwave-game.jpg',
      stats: { fps: '60 FPS', rank: 'A+', year: '2026' },
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com'
    },
    {
      id: 'neon-vault',
      title: 'NEON VAULT dAPP',
      subtitle: 'Futuristic Crypto Asset Interface',
      category: 'WEB3 / FINTECH',
      description: 'Decentralized liquidity vault management protocol featuring real-time interactive charts, dark mode glassmorphism UI, and smart contract integration.',
      tags: ['REACT', 'ETHERS.JS', 'SOLIDITY', 'TAILWIND', 'VIEM'],
      image: '/assets/synthwave-game.jpg',
      stats: { tvl: '$42M', rank: 'PRO', year: '2025' },
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com'
    },
    {
      id: 'aether-engine',
      title: 'AETHER 3D STUDIO',
      subtitle: 'Realtime Browser Renderer',
      category: 'CREATIVE TOOL',
      description: 'Browser-based node renderer and shader editor designed for 3D artists, game creators, and visual experience designers.',
      tags: ['REACT', 'WEBGPU', 'CANVAS', 'TYPESCRIPT'],
      image: '/assets/synthwave-game.jpg',
      stats: { speed: '120Hz', rank: 'S-TIER', year: '2026' },
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com'
    }
  ];

  const currentProject = projects[activeProjectIndex];

  // Mouse tilt logic
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // max 12 deg tilt
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <section id="work" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Background glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[2px] bg-cyan-400"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">PORTFOLIO SHOWCASE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight">
            FEATURED WORK
          </h2>
        </div>

        {/* Project Selector Switcher */}
        <div className="flex items-center gap-2 p-1.5 glass-panel rounded-full border border-white/10 self-start md:self-auto">
          {projects.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveProjectIndex(idx)}
              className={`px-4 py-2 rounded-full text-xs font-bold font-mono tracking-wider transition-all ${
                activeProjectIndex === idx
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              0{idx + 1}. {p.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Holographic 3D Card Showcase, Right Project Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: 3D Holographic Interactive Game Trading Card */}
        <div className="lg:col-span-6 flex justify-center">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: transformStyle, transition: 'transform 0.15s ease-out' }}
            className="w-full max-w-md holo-card-frame cursor-pointer select-none"
          >
            <div className="holo-card-inner p-5 flex flex-col gap-4 relative overflow-hidden">
              
              {/* Top Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
                    {currentProject.category}
                  </span>
                </div>
                <div className="px-2.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-[10px] font-mono text-purple-300 font-bold">
                  CARD #{activeProjectIndex + 1}
                </div>
              </div>

              {/* Main Artwork Frame */}
              <div className="relative aspect-video rounded-lg overflow-hidden border border-purple-500/30 group">
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Holographic Sheen Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-cyan-500/20 pointer-events-none" />
                
                {/* Status Badges */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 glass-panel rounded text-[11px] font-mono text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    STATUS: ACTIVE
                  </span>
                  <span className="px-2.5 py-1 glass-panel rounded text-[11px] font-mono text-purple-300 border border-purple-400/40 font-bold">
                    {currentProject.stats.year}
                  </span>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white tracking-wider">
                    {currentProject.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{currentProject.subtitle}</p>
                </div>

                <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {Object.values(currentProject.stats)[0]}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Detailed Project Information */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-purple-400 tracking-widest uppercase">
                // PROJECT DETAILS 0{activeProjectIndex + 1}
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/30">
                LATEST RELEASE
              </span>
            </div>

            <div>
              <h3 className="text-3xl font-black font-heading text-white tracking-wide mb-2">
                {currentProject.title}
              </h3>
              <p className="text-slate-300 text-base leading-relaxed">
                {currentProject.description}
              </p>
            </div>

            {/* Tech Stack Tags */}
            <div>
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">TECHNOLOGY STACK</h4>
              <div className="flex flex-wrap gap-2">
                {currentProject.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-slate-200 text-xs font-mono font-semibold hover:border-purple-500/50 hover:text-purple-300 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Links CTA */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-purple-500/20 hover:scale-105 transition-all"
              >
                <span>LAUNCH PROJECT</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={currentProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel border border-white/10 text-slate-300 hover:text-white font-bold text-xs tracking-wider uppercase hover:border-purple-500/50 transition-all"
              >
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>SOURCE CODE</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
