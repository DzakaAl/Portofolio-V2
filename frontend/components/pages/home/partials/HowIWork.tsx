'use client';
import React, { useRef, useEffect } from 'react';
import { Search, PenTool, Code2, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from '@/components/ui/Card';

interface WorkPhase {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
}

interface HowIWorkProps {
  onOpenContact?: () => void;
}

export default function HowIWork(_: HowIWorkProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  const phases: WorkPhase[] = [
    {
      icon: Search,
      title: "DISCOVER & STRATEGY",
      subtitle: "Requirement Mapping",
      description: "Defining scope, goals, and constraints upfront so the project starts with a clear direction and measurable outcomes.",
    },
    {
      icon: PenTool,
      title: "DESIGN & PROTOTYPE",
      subtitle: "UI/UX & Interactive Mockups",
      description: "Translating requirements into wireframes, a cohesive design system, and a clickable prototype before writing code.",
    },
    {
      icon: Code2,
      title: "BUILD & INTEGRATE",
      subtitle: "Engineering & Integration",
      description: "Shipping in iterative sprints with code reviews, API integrations, and custom features refined at every step.",
    },
    {
      icon: Rocket,
      title: "LAUNCH & GROW",
      subtitle: "Deployment & Support",
      description: "Final QA, performance tuning, and a smooth handoff â€” then monitoring and iterating after launch.",
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header fade & slide up
      if (headerRef.current) {
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
            },
          }
        );
      }

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
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="relative py-28 px-5 sm:px-10 lg:px-14 max-w-[1600px] mx-auto overflow-hidden select-none">

      {/* Header */}
      <div ref={headerRef} className="mb-16">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-tech text-white tracking-tight leading-none mb-4">
          HOW I WORK
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/40 via-white/15 to-transparent md:-translate-x-1/2" />

        <div className="space-y-10 md:space-y-12">
          {phases.map((phase, idx) => {
            const IconComponent = phase.icon;
            const isLeft = idx % 2 === 0;

            return (
              <div key={idx} className={`relative flex items-start md:items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Node Marker */}
                <div className="absolute left-5 md:left-1/2 top-1 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full glass-panel border border-white/20 flex items-center justify-center bg-[#0a0a0a] shadow-lg">
                    <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>

                {/* Card */}
                <div
                  ref={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                  className={`pl-12 md:pl-0 w-full md:w-[calc(50%-4rem)] ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}
                >
                  <Card variant="glass" hoverEffect={false}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                      <span className="font-mono text-xs text-white/40 font-bold tracking-widest uppercase">
                        PHASE 0{idx + 1}
                      </span>
                      <span className="text-xs font-mono text-sky-400/90 tracking-wider truncate">
                        {phase.subtitle}
                      </span>
                    </div>

                    <h3 className="font-tech font-bold text-lg sm:text-xl text-white tracking-wider mb-2">
                      {phase.title}
                    </h3>
                    
                    <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-light">
                      {phase.description}
                    </p>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}