import React from 'react';

/**
 * "Split" brand mark — a circle split in two: an open white arc (design) and a
 * solid sky half (code). Rendered as two layers separated in Z so it reads as
 * 3D: it idles with a slow tilt and leans toward the pointer on hover.
 */
export default function Logo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`logo-3d relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="DzakaAl"
    >
      <span className="logo-3d-inner absolute inset-0">
        {/* back layer: outline arc */}
        <svg viewBox="0 0 64 64" className="logo-3d-back absolute inset-0 h-full w-full" aria-hidden>
          <path d="M14.5 49.5 A24 24 0 0 1 49.5 14.5" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
        </svg>
        {/* front layer: solid half */}
        <svg viewBox="0 0 64 64" className="logo-3d-front absolute inset-0 h-full w-full" aria-hidden>
          <path d="M53.6 20.4 A24 24 0 0 1 20.4 53.6 Z" fill="#38bdf8" />
        </svg>
      </span>
    </span>
  );
}
