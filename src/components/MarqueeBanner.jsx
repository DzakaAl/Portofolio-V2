import React from 'react';
import { Star } from 'lucide-react';

export default function MarqueeBanner() {
  const items = [
    "DEVELOPMENT",
    "BRANDING",
    "3D EXPERIENCES",
    "GAME UI/UX",
    "WEB3 ARCHITECTURE",
    "CYBER SYSTEMS",
    "INTERACTIVE MOTION"
  ];

  return (
    <div className="relative py-4 bg-[#0a0c16] border-y border-white/10 overflow-hidden select-none">
      <div className="flex w-full overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {items.concat(items).map((item, idx) => (
            <div key={idx} className="flex items-center gap-8">
              <span className="font-heading font-black text-xl md:text-2xl text-slate-300 tracking-widest hover:text-purple-400 transition-colors">
                {item}
              </span>
              <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
