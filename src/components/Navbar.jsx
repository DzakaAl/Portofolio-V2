import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { href: '#about', label: 'ABOUT ME' },
  { href: '#work', label: 'FEATURED WORK' },
  { href: '#services', label: 'SERVICES' },
];

export default function Navbar({ onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${
            scrolled ? 'glass-panel-strong shadow-2xl' : 'glass-panel'
          }`}
        >
          {/* Logo / Brand Monogram */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/60 to-white/20 p-[1px] shadow-lg shadow-white/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                <img src="/assets/chrome-logo.jpg" alt="EXTIZ Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg tracking-wider text-white">
                EXTIZ
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
                STUDIO 2026
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`transition-colors duration-300 text-sm ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* CTA Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenContact}
              className="group overflow-hidden rounded-full p-[1px] bg-gradient-to-r from-white/50 via-white/25 to-white/50 font-semibold text-sm transition-transform active:scale-95"
            >
              <span className="relative flex items-center gap-2 px-5 py-2.5 bg-black rounded-full text-white group-hover:bg-white group-hover:text-black transition-all">
                <span>LET'S TALK</span>
                <ArrowUpRight className="w-4 h-4 text-white group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 glass-panel-strong rounded-2xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`font-medium tracking-wider text-sm py-2 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white rounded-xl text-black font-semibold text-sm mt-2"
            >
              <span>LET'S TALK</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
