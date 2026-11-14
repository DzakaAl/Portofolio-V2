'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';
import type { Lang } from '@/lib/translations';

interface LanguageToggleProps {
  className?: string;
  variant?: 'compact' | 'full';
}

const OPTIONS: Array<{ value: Lang; label: string; fullLabel: string }> = [
  { value: 'en', label: 'EN', fullLabel: 'ENGLISH' },
  { value: 'id', label: 'ID', fullLabel: 'INDONESIA' },
];

export default function LanguageToggle({ className = '', variant = 'compact' }: LanguageToggleProps) {
  const { lang, setLang } = useLanguage();

  if (variant === 'full') {
    return (
      <div
        role="group"
        aria-label="Language / Bahasa"
        className={`flex w-full rounded-xl border border-white/15 bg-white/[0.04] p-1 ${className}`}
      >
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setLang(option.value)}
            aria-pressed={lang === option.value}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
              lang === option.value
                ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.35)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {option.fullLabel}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language / Bahasa"
      className={`flex items-center rounded-full border border-white/15 bg-white/[0.04] p-0.5 ${className}`}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => setLang(option.value)}
          aria-pressed={lang === option.value}
          className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold tracking-widest transition-all cursor-pointer ${
            lang === option.value
              ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.35)]'
              : 'text-white/50 hover:text-white'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
