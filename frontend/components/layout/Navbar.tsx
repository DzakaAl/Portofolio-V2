'use client';
import React, { useState, useEffect, useRef, useId } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import LanguageToggle from '../ui/LanguageToggle';
import { useLanguage } from '@/lib/i18n';

interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: 'R' | 'G' | 'B';
  yChannel?: 'R' | 'G' | 'B';
  mixBlendMode?: string;
  className?: string;
  style?: React.CSSProperties;
}

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDark;
};

function GlassSurface({
  children,
  width = '100%',
  height = 'auto',
  borderRadius = 9999,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0.25,
  saturation = 1.8,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  className = '',
  style = {}
}: GlassSurfaceProps) {
  const uniqueId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const [svgSupported, setSvgSupported] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);

  const isDarkMode = useDarkMode();

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    feImageRef.current?.setAttribute('href', generateDisplacementMap());
  };

  useEffect(() => {
    updateDisplacementMap();
    (
      [
        { ref: redChannelRef, offset: redOffset },
        { ref: greenChannelRef, offset: greenOffset },
        { ref: blueChannelRef, offset: blueOffset }
      ] as Array<{ ref: React.RefObject<SVGFEDisplacementMapElement | null>; offset: number }>
    ).forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute('scale', (distortionScale + offset).toString());
        ref.current.setAttribute('xChannelSelector', xChannel);
        ref.current.setAttribute('yChannelSelector', yChannel);
      }
    });

    gaussianBlurRef.current?.setAttribute('stdDeviation', displace.toString());
  }, [
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
    displace,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
    mixBlendMode
  ]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    if (!isWebkit && !isFirefox) {
      const div = document.createElement('div');
      div.style.backdropFilter = `url(#${filterId})`;
      setSvgSupported(div.style.backdropFilter !== '');
    }
  }, [filterId]);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateDisplacementMap, 0);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const getContainerStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      ...style,
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    };

    if (svgSupported) {
      return {
        ...baseStyles,
        background: `rgba(0, 0, 0, ${backgroundOpacity})`,
        backdropFilter: `url(#${filterId}) saturate(${saturation})`,
        boxShadow: `0 0 2px 1px color-mix(in oklch, white, transparent 75%) inset,
                   0 0 10px 4px color-mix(in oklch, white, transparent 90%) inset,
                   0px 8px 32px rgba(0, 0, 0, 0.4)`
      };
    } else {
      return {
        ...baseStyles,
        background: 'rgba(10, 10, 10, 0.65)',
        backdropFilter: 'blur(20px) saturate(1.8) brightness(1.1)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8) brightness(1.1)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
      };
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-between overflow-hidden transition-all duration-300 ${className}`}
      style={getContainerStyles()}
    >
      <svg
        className="w-full h-full pointer-events-none absolute inset-0 opacity-0 -z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

            <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" id="redchannel" result="dispRed" />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />

            <feDisplacementMap
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              id="greenchannel"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />

            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" id="bluechannel" result="dispBlue" />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      <div className="w-full flex items-center justify-between px-6 py-2 rounded-[inherit] relative z-10">
        {children}
      </div>
    </div>
  );
}

const navLinks: Array<{ href: string; labelKey: string }> = [
  { href: '#about', labelKey: 'nav.about' },
  { href: '#work', labelKey: 'nav.work' },
  { href: '#process', labelKey: 'nav.process' },
  { href: '/contact', labelKey: 'nav.contact' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isContactPage = pathname === '/contact';
  // Link aktif: section di home, atau halaman /contact
  const currentActive = isContactPage ? '/contact' : activeSection;

  // Navigasi ke home dari halaman lain; bawa target hash via sessionStorage
  const goHome = (targetHash?: string) => {
    if (targetHash) {
      sessionStorage.setItem('scroll_to_hash', targetHash);
    }
    router.push('/');
  };

  const scrollToHash = (targetHash: string) => {
    const targetElement = document.querySelector(targetHash);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .filter(({ href }) => href.startsWith('#'))
      .map(({ href }) => document.querySelector(href))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isHome) {
      goHome();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetHash: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    // Link rute halaman (mis. /contact)
    if (targetHash.startsWith('/')) {
      router.push(targetHash);
      return;
    }
    if (!isHome) {
      goHome(targetHash);
    } else {
      scrollToHash(targetHash);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassSurface
          borderRadius={9999}
          backgroundOpacity={scrolled ? 0.65 : 0.35}
          blur={16}
          saturation={1.8}
          className={`transition-all duration-300 border ${
            scrolled ? 'border-white/25 shadow-2xl' : 'border-white/15 shadow-xl'
          }`}
        >
          {/* Brand Logo: Soft Sky Blue Icon + Love Light DzakaAl Text */}
          <a
            href="/"
            onClick={handleBrandClick}
            className="flex items-center gap-2.5 group py-1 shrink-0"
          >
            <span className="font-lovelight text-sky-400 text-3xl sm:text-4xl font-semibold leading-none whitespace-nowrap group-hover:text-sky-300 transition-colors drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)]">
              DzakaAl
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8 text-xs lg:text-sm font-tech font-bold tracking-wider shrink-0">
            {navLinks.map((link) => {
              const isActive = currentActive === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`whitespace-nowrap transition-all duration-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${
                    isActive
                      ? 'text-white font-extrabold drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] scale-105'
                      : 'text-slate-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                  }`}
                >
                  {t(link.labelKey)}
                </a>
              );
            })}
          </nav>

          {/* Language Switcher — desktop only (mobile: full toggle di dropdown menu) */}
          <div className="hidden md:flex items-center shrink-0">
            <LanguageToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-slate-200 focus:outline-none drop-shadow cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </GlassSurface>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 glass-panel-strong rounded-2xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
            {navLinks.map((link) => {
              const isActive = currentActive === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(e, link.href);
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={`font-medium tracking-wider text-sm py-2 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {t(link.labelKey)}
                </a>
              );
            })}

            {/* Language Switcher — dipisah di bagian bawah sendiri, full width */}
            <div className="border-t border-white/10 pt-4 mt-1">
              <LanguageToggle variant="full" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
