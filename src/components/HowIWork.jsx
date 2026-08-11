import React from 'react';
import { Search, PenTool, Code2, Rocket, CheckCircle2 } from 'lucide-react';

export default function HowIWork({ onOpenContact }) {
  const phases = [
    {
      icon: Search,
      title: "DISCOVER & STRATEGY",
      subtitle: "Requirement Mapping",
      description: "Defining scope, goals, and constraints upfront so the project starts with a clear direction and measurable outcomes.",
      deliverables: ["Requirement Blueprint", "Tech Stack Proposal", "Project Roadmap", "Milestones"]
    },
    {
      icon: PenTool,
      title: "DESIGN & PROTOTYPE",
      subtitle: "UI/UX & Interactive Mockups",
      description: "Translating requirements into wireframes, a cohesive design system, and a clickable prototype before a single line of code.",
      deliverables: ["Wireframes & Sitemaps", "Design System", "Interactive Prototype", "Feedback Rounds"]
    },
    {
      icon: Code2,
      title: "BUILD & INTEGRATE",
      subtitle: "Engineering & Integration",
      description: "Shipping in iterative sprints with code reviews, API integrations, and custom features refined at every step.",
      deliverables: ["Weekly Sprints", "Code Reviews", "API Integrations", "Custom Features"]
    },
    {
      icon: Rocket,
      title: "LAUNCH & GROW",
      subtitle: "Deployment & Support",
      description: "Final QA, performance tuning, and a smooth handoff — then monitoring and iterating after launch.",
      deliverables: ["QA & Performance Audit", "CI/CD Deployment", "Documentation", "Post-Launch Support"]
    }
  ];

  return (
    <section id="process" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="w-8 h-[2px] bg-white"></span>
          <span className="font-mono text-xs uppercase tracking-widest text-white/70">PROCESS</span>
          <span className="w-8 h-[2px] bg-white"></span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold font-tech text-white tracking-tight mb-4">
          FROM IDEA TO LAUNCH
        </h2>
        <p className="text-slate-400 text-base">
          A battle-tested four-phase workflow built for speed, clarity, and zero surprises.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/40 via-white/15 to-transparent md:-translate-x-1/2"></div>

        <div className="space-y-12">
          {phases.map((phase, idx) => {
            const IconComponent = phase.icon;
            const isLeft = idx % 2 === 0;
            return (
              <div key={idx} className={`relative flex md:items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}>
                {/* Node Marker */}
                <div className="absolute left-6 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10">
                  <div className="relative w-12 h-12 rounded-full glass-panel border border-white/20 flex items-center justify-center bg-[#0a0a0a]">
                    <IconComponent className="w-5 h-5 text-white" />
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] text-slate-500 font-bold tracking-widest">
                      0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Card */}
                <div className={`ml-16 md:ml-0 w-full md:w-[calc(50%-4rem)] ${isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto'}`}>
                  <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs text-slate-500 font-bold tracking-widest">
                        PHASE 0{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-tech font-bold text-xl text-white tracking-wider mb-2 group-hover:text-white transition-colors">
                      {phase.title}
                    </h3>
                    <p className="text-xs font-mono text-white/60 mb-4 tracking-wider uppercase">
                      {phase.subtitle}
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {phase.description}
                    </p>

                    <div className="pt-6 border-t border-white/10 space-y-2">
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-3">KEY DELIVERABLES</div>
                      <div className="grid grid-cols-2 gap-2">
                        {phase.deliverables.map((item, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="mt-20 text-center">
        <div className="inline-flex items-center gap-4 p-4 glass-panel rounded-full border border-white/10">
          <span className="text-xs font-mono text-slate-300 pl-4">READY TO START YOUR PROJECT?</span>
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