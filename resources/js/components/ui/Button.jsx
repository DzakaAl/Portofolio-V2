import React from 'react';

/**
 * Reusable Button Component
 * Supporting variants: 'primary', 'secondary', 'outline', 'glass', 'icon'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  target,
  rel,
  disabled = false,
  icon: Icon,
  iconPosition = 'right',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none';

  const variantStyles = {
    primary:
      'rounded-full bg-white text-black font-extrabold tracking-[0.15em] uppercase shadow-[0_2px_12px_rgba(255,255,255,0.2)] hover:shadow-[0_0_16px_rgba(255,255,255,0.6)] hover:scale-[1.03] active:scale-95',
    secondary:
      'rounded-full bg-black/90 text-white border border-white/20 hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.4)] active:scale-95',
    outline:
      'rounded-full border border-white/20 text-white hover:border-white hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.3)] active:scale-95',
    glass:
      'rounded-full glass-panel border border-white/15 text-slate-300 hover:text-white hover:border-white/50 hover:shadow-[0_0_14px_rgba(255,255,255,0.35)] hover:scale-[1.03] active:scale-95',
    icon:
      'rounded-full glass-panel border border-white/25 text-slate-300 hover:text-white hover:border-white hover:scale-105 hover:shadow-[0_0_14px_rgba(255,255,255,0.4)] active:scale-95',
    ghost:
      'rounded-full text-white/60 hover:text-white hover:scale-105 active:scale-95',
    danger:
      'rounded-full bg-red-600 text-white font-extrabold tracking-[0.15em] uppercase border border-red-500/50 shadow-[0_2px_12px_rgba(239,68,68,0.3)] hover:bg-red-500 hover:border-red-400 hover:shadow-[0_0_18px_rgba(239,68,68,0.7)] hover:scale-[1.03] active:scale-95',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs',
    md: 'px-4 py-2 sm:px-6 sm:py-3 text-[11px] sm:text-xs',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 text-[11px] sm:text-xs',
    icon: 'w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 p-0',
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${
    variant === 'icon' ? sizeStyles.icon : sizeStyles[size] || sizeStyles.md
  } ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''} transition-transform`} />
      )}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && (
        <Icon className={`w-4 h-4 ${children ? 'ml-2' : ''} transition-transform`} />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClasses}
        onClick={onClick}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}
