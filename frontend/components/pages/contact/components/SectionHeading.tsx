'use client';
import React from 'react';

interface SectionHeadingProps {
  title: string;
}

/**
 * Section heading bersama agar kolom kiri & kanan selalu simetris.
 */
export default function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <div className="mb-5 shrink-0">
      <div className="flex items-center gap-5">
        <h2 className="font-tech font-black text-2xl sm:text-3xl tracking-wider text-white uppercase whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/30 to-transparent" />
        <div className="w-1.5 h-1.5 rotate-45 bg-white/40 shrink-0" />
      </div>
    </div>
  );
}
