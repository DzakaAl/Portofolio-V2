'use client';
import React from 'react';
import { ArrowUp, Mail, Globe, Sparkles, Send } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '@/lib/i18n';

interface FooterProps {
  onOpenContact?: () => void;
}

interface NavLink {
  labelKey: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Footer({ onOpenContact }: FooterProps) {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: NavLink[] = [
    { labelKey: 'nav.about', href: '#about' },
    { labelKey: 'nav.work', href: '#work' },
    { labelKey: 'nav.process', href: '#process' },
  ];

  const socialLinks: SocialLink[] = [
    {
      label: 'GitHub',
      href: 'https://github.com',
      icon: (props) => (
        <svg className={props.className} fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (props) => (
        <svg className={props.className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
        </svg>
      ),
    },
    {
      label: 'Email',
      href: 'mailto:contact@dzakaal.com',
      icon: (props) => <Mail className={props.className} />,
    },
  ];

  return (
    <footer className="relative bg-black border-t border-white/10 pt-16 pb-28 sm:pb-20 lg:pb-16 px-5 sm:px-10 lg:px-14 max-w-[1600px] mx-auto overflow-hidden">
      <div className="w-full space-y-14 relative z-10">
        
        {/* Main Clean Centerpiece (No card container, no gradients) */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          
          {/* Sky Blue Logo Accent */}
          <span className="font-lovelight text-sky-400 text-6xl sm:text-7xl font-semibold leading-none drop-shadow-[0_2px_12px_rgba(56,189,248,0.3)] inline-block hover:scale-105 transition-transform duration-300">
            DzakaAl
          </span>

          <div className="space-y-3">
            <h3 className="font-tech font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-none uppercase">
              {t('footer.ideaTitle')}
            </h3>
            
            <p className="font-mono text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed pt-1">
              {t('footer.ideaSubtitle')}
            </p>
          </div>

          <div className="pt-2">
            <Button
              onClick={onOpenContact}
              variant="primary"
              size="lg"
              icon={Send}
              iconPosition="right"
            >
              {t('footer.getInTouch')}
            </Button>
          </div>
        </div>

        {/* Navigation & Social Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/10 text-xs font-mono text-slate-400">
          
          {/* Nav Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 order-1 md:order-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors duration-200"
              >
                {t(link.labelKey)}
              </a>
            ))}
            <button
              onClick={onOpenContact}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {t('footer.contact')}
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 order-2 md:order-2">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/40 transition-all duration-300"
                >
                  <IconComponent className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          {/* Back to Top */}
          <div className="order-3 md:order-3">
            <Button
              onClick={scrollToTop}
              variant="ghost"
              size="sm"
              icon={ArrowUp}
              iconPosition="right"
              className="hover:text-white"
            >
              {t('footer.backToTop')}
            </Button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="text-center text-[11px] sm:text-xs font-mono text-slate-600 pt-2 border-t border-white/5">
          {t('footer.copyright')}
        </div>

      </div>
    </footer>
  );
}

