'use client';
import React from 'react';

type CardVariant = 'glass' | 'solid' | 'outline';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  hoverEffect?: boolean;
}

/**
 * Reusable Card Component
 * Variants: 'glass', 'solid', 'outline'
 */
export default function Card({
  children,
  variant = 'glass',
  className = '',
  hoverEffect = true,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-3xl transition-all duration-300 relative overflow-hidden';

  const variantStyles: Record<CardVariant, string> = {
    glass:
      'glass-card p-6 sm:p-8 border border-white/10 shadow-xl bg-black/40 backdrop-blur-md',
    solid:
      'bg-[#0a0a0a] p-6 sm:p-8 border border-white/10 shadow-2xl',
    outline:
      'bg-transparent p-6 sm:p-8 border border-white/15',
  };

  const hoverStyles = hoverEffect
    ? 'hover:border-white/30 hover:shadow-2xl hover:scale-[1.01]'
    : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
