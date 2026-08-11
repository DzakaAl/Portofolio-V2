import React, { useRef, useEffect } from 'react';
import { Search, PenTool, Code2, Rocket } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HowIWork({ onOpenContact }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header fade & slide up
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 2. Timeline cards staggered scroll reveal
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        const isLeft = idx % 2 === 0;
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: isLeft ? -80 : 80,
            y: 30,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="relative py-28 px-5 sm:px-10 lg:px-14 max-w-[1600px] mx-auto overflow-hidden select-none">

      {/* Header — Aligned with About & Featured Work style */}
      <div ref={headerRef} className="mb-16">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-tech text-white tracking-tight leading-none mb-4">
          HOW I WORK
        </h2>
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
                  </div>
                </div>

                {/* Card — No hover effects */}
                <div
                  ref={(el) => (cardsRef.current[idx] = el)}
                  className={`ml-16 md:ml-0 w-full md:w-[calc(50%-4rem)] ${isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto'}`}
                >
                  <div className="glass-card p-7 rounded-3xl border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs text-white/40 font-bold tracking-widest uppercase">
                        PHASE 0{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-tech font-bold text-xl text-white tracking-wider mb-3">
                      {phase.title}
                    </h3>
                    
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                      {phase.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}