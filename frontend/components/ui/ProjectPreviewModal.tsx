'use client';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { ShieldAlert, Lock, X } from 'lucide-react';
import type { Project } from '@/lib/types';

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onOpenContact?: () => void;
}

type DeviceMode = 'desktop' | 'mobile';

const LIMITED_ACCESS_DELAY_MS = 15000;

export default function ProjectPreviewModal({
  isOpen,
  onClose,
  project,
  onOpenContact,
}: ProjectPreviewModalProps) {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [locked, setLocked] = useState(false);

  // Panel shape follows the viewer's device; the vitrine locks after the viewing window
  useEffect(() => {
    if (!isOpen) return;
    setDevice(window.innerWidth < 768 ? 'mobile' : 'desktop');
    setLocked(false);
    const timer = setTimeout(() => setLocked(true), LIMITED_ACCESS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isOpen, project]);

  if (!project) return null;

  // Preview ratio: 16:9 desktop / 9:20 mobile — sized so panel + header + padding always fit the viewport
  const panelStyle: React.CSSProperties =
    device === 'desktop'
      ? {
          width: 'min(1280px, calc((100dvh - 10rem) * 16 / 9), calc(100vw - 3.5rem))',
          aspectRatio: '16 / 9',
        }
      : {
          height: 'min(calc(100dvh - 12rem), calc((100vw - 3.5rem) * 20 / 9))',
          aspectRatio: '9 / 20',
          margin: '0 auto',
        };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-none"
      hideClose
      className="!p-0 !w-fit !max-w-none !max-h-none !overflow-visible"
    >
      <style>{`
        @keyframes pvm-panel-in { from { opacity: 0; transform: scale(0.94) translateY(14px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes pvm-fade-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pvm-sheen { from { transform: translateX(-130%) skewX(-18deg); } to { transform: translateX(360%) skewX(-18deg); } }
        @keyframes pvm-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pvm-card-in { from { opacity: 0; transform: translateY(18px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pvm-stagger { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .pvm-panel { animation: pvm-panel-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .pvm-panel[data-locked='true'] { transform: scale(0.99); }
        .pvm-chip { animation: pvm-fade-down 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both; }
        .pvm-sheen { animation: pvm-sheen 1.4s cubic-bezier(0.4, 0, 0.2, 1) 0.35s both; }
        .pvm-overlay { animation: pvm-overlay-in 0.5s ease-out both; }
        .pvm-card { animation: pvm-card-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .pvm-stagger { animation: pvm-stagger 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .pvm-panel, .pvm-chip, .pvm-sheen, .pvm-overlay, .pvm-card, .pvm-stagger { animation-duration: 0.01ms !important; animation-delay: 0ms !important; }
          .pvm-panel { transition: none !important; }
        }
      `}</style>

      <div className="pvm-panel relative" data-locked={locked}>
        {/* ── Modal Header ── */}
        <div className="pvm-chip flex items-center gap-2.5 px-4 sm:px-5 py-3 border-b border-white/10">
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5 motion-safe:animate-ping">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[9px] font-mono tracking-[0.25em] text-emerald-300">LIVE</span>
          </span>

          <span className="h-3.5 w-px bg-white/15 shrink-0" />

          <h3 className="flex-1 min-w-0 truncate text-sm font-bold uppercase tracking-wide text-white font-tech">
            {project.title}
          </h3>

          <button
            onClick={onClose}
            aria-label="Close preview"
            className="shrink-0 w-8 h-8 rounded-full border border-white/15 bg-white/[0.04] text-white/60 hover:text-white hover:bg-red-600/80 hover:border-red-500/60 hover:shadow-[0_0_14px_rgba(239,68,68,0.5)] active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Preview Body ── */}
        <div className="p-3 sm:p-4">
          {/* Vitrine frame — gradient hairline around the live site */}
          <div
            className="relative rounded-2xl p-px"
            style={{
              ...panelStyle,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 38%, rgba(255,255,255,0.04) 62%, rgba(255,255,255,0.2) 100%)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.75)',
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[15px] bg-[#050508]">
              {/* Live site — native scrolling, real layout; sandbox blocks navigation/popups/form submits */}
              <iframe
                src={project.link || undefined}
                title={project.title}
                sandbox="allow-scripts allow-same-origin"
                tabIndex={locked ? -1 : 0}
                inert={locked || undefined}
                className="absolute inset-0 h-full w-full border-0"
              />

              {/* One-time sheen sweep */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[15px]" aria-hidden="true">
                <div className="pvm-sheen absolute -top-1/2 left-0 h-[200%] w-[38%] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              </div>

              {/* Limited Access — the vitrine frosts over, everything stops */}
              {locked && (
                <div className="pvm-overlay absolute inset-0 z-30 flex items-center justify-center bg-black/70 px-6 backdrop-blur-2xl">
                  <div className="pvm-card w-full max-w-sm space-y-5 text-center">
                    <div className="relative mx-auto h-16 w-16">
                      <span className="absolute inset-0 rounded-full border border-white/15" />
                      <span className="absolute -inset-2 rounded-full border border-white/10" />
                      <span className="absolute inset-0 motion-safe:animate-ping rounded-full bg-white/10 [animation-duration:2.4s]" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] shadow-[0_0_40px_rgba(56,189,248,0.25)]">
                        <Lock className="h-7 w-7 text-sky-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="pvm-stagger text-base font-bold uppercase tracking-widest text-white [animation-delay:0.15s]">
                        Limited Access
                      </h4>
                      <p className="pvm-stagger mx-auto max-w-[36ch] text-xs leading-relaxed text-white/60 [animation-delay:0.28s]">
                        This preview shows the home page only. For full access, source code, or a complete interactive live demo, contact the developer.
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        onClose();
                        if (onOpenContact) onOpenContact();
                      }}
                      variant="primary"
                      size="md"
                      icon={ShieldAlert}
                      iconPosition="left"
                      className="pvm-stagger w-full [animation-delay:0.4s]"
                    >
                      FULL ACCESS / CONTACT ME
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
