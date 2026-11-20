import React from 'react';

type SectionDecorProps = {
  /** which side the big ring sits on */
  side?: 'left' | 'right';
  /** hairline glow at the top edge */
  hairline?: boolean;
  className?: string;
};

/** Per-section accent: orbit ring + beam + plus marks. Put inside a `relative isolate` section. */
export function SectionDecor({ side = 'right', hairline = true, className = '' }: SectionDecorProps) {
  const right = side === 'right';
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {hairline && <div className="deco-hairline" />}
      <div
        className="deco-ring h-[46vw] max-h-[620px] w-[46vw] max-w-[620px]"
        style={{ top: '14%', [right ? 'right' : 'left']: '-12vw' } as React.CSSProperties}
      >
        <span className="deco-orbit"><i className="deco-orbit-dot" /></span>
      </div>
      <div className="deco-beam" style={{ height: '36%', top: '8%', [right ? 'left' : 'right']: '6%' } as React.CSSProperties} />
      <span className="deco-plus" style={{ top: '12%', [right ? 'left' : 'right']: '14%' } as React.CSSProperties} />
      <span className="deco-plus" style={{ animationDelay: '-3s', bottom: '14%', [right ? 'right' : 'left']: '10%' } as React.CSSProperties} />
    </div>
  );
}

/** Hero: thin orbit rings + marks (no colour wash — background stays pure black). */
export function HeroDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="deco-ring left-1/2 top-[8%] h-[min(88vw,980px)] w-[min(88vw,980px)] -translate-x-1/2">
        <span className="deco-orbit"><i className="deco-orbit-dot" /></span>
        <span className="deco-orbit rev" style={{ inset: '9%' }}><i className="deco-orbit-dot" style={{ background: '#a5b4fc', boxShadow: '0 0 14px 3px rgba(165,180,252,0.7)' }} /></span>
      </div>
      <span className="deco-plus" style={{ top: '22%', left: '8%' }} />
      <span className="deco-plus" style={{ top: '62%', right: '7%' }} />
    </div>
  );
}

/** Footer: glowing top edge only. */
export function FooterDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="deco-hairline" />
    </div>
  );
}
