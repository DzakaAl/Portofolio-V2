import React from 'react';

/** Shared section heading: big uppercase title + gradient rule. Used by every home section. */
export const SECTION_TITLE = 'font-tech text-5xl font-bold uppercase leading-none tracking-tight text-white sm:text-7xl lg:text-8xl';
export const SECTION_LINE = 'mt-8 block h-px w-full bg-gradient-to-r from-sky-400 via-white/15 to-transparent';

export default function SectionHeading({ title, className = '' }: { title: string; className?: string }) {
  return (
    <div className={className}>
      <h2 className={SECTION_TITLE}>{title}</h2>
      <span className={`sec-line ${SECTION_LINE}`} />
    </div>
  );
}
