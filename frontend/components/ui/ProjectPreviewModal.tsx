'use client';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { X } from 'lucide-react';
import type { Project } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onOpenContact?: () => void;
}

type DeviceMode = 'desktop' | 'mobile';

const PREVIEW_ZOOM = 0.8; // < 1 = zoom out (iframe renders larger, then scales down to fit the panel)

export default function ProjectPreviewModal({
  isOpen,
  onClose,
  project,
}: ProjectPreviewModalProps) {
  const { tl } = useLanguage();
  const [device, setDevice] = useState<DeviceMode>('desktop');

  // Panel shape follows the viewer's device
  useEffect(() => {
    if (!isOpen) return;
    setDevice(window.innerWidth < 768 ? 'mobile' : 'desktop');
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
        .pvm-panel { animation: pvm-panel-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .pvm-chip { animation: pvm-fade-down 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both; }
        .pvm-sheen { animation: pvm-sheen 1.4s cubic-bezier(0.4, 0, 0.2, 1) 0.35s both; }
        @media (prefers-reduced-motion: reduce) {
          .pvm-panel, .pvm-chip, .pvm-sheen { animation-duration: 0.01ms !important; animation-delay: 0ms !important; }
          .pvm-panel { transition: none !important; }
        }
      `}</style>

      <div className="pvm-panel relative">
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
            {tl(project.title)}
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
                className="absolute left-0 top-0 border-0"
                style={{
                  width: `${100 / PREVIEW_ZOOM}%`,
                  height: `${100 / PREVIEW_ZOOM}%`,
                  transform: `scale(${PREVIEW_ZOOM})`,
                  transformOrigin: 'top left',
                }}
              />

              {/* One-time sheen sweep */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[15px]" aria-hidden="true">
                <div className="pvm-sheen absolute -top-1/2 left-0 h-[200%] w-[38%] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
