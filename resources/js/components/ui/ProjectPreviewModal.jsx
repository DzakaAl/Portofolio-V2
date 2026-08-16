import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { ShieldAlert, ExternalLink, Lock, Globe } from 'lucide-react';

export default function ProjectPreviewModal({ isOpen, onClose, project, onOpenContact }) {
  if (!project) return null;

  const activePreviewUrl = project.link || `https://preview.dzakaal.dev/${project.slug || ''}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
      <div className="space-y-4">
        {/* Header Bar with Simulated Browser URL */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white font-tech uppercase">{project.title}</h3>
            <p className="text-xs text-slate-400">Pratinjau Terbatas (1 Halaman Utama)</p>
          </div>

          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/15 text-xs text-slate-300 w-full sm:w-auto overflow-hidden">
            <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-mono truncate max-w-[280px] text-[11px]">{activePreviewUrl}</span>
          </div>
        </div>

        {/* Preview Frame Area with Overlay */}
        <div className="relative w-full h-[60vh] sm:h-[65vh] rounded-2xl overflow-hidden bg-black/90 border border-white/15 group">
          {/* Iframe View */}
          <iframe
            src={activePreviewUrl}
            title={project.title}
            className="w-full h-full border-0 pointer-events-none select-none opacity-80"
          />

          {/* Locked Overlay Badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col items-center justify-end p-6 sm:p-8 text-center pointer-events-auto">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/15 max-w-lg space-y-4 shadow-2xl backdrop-blur-xl">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-sky-400">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-white font-tech uppercase">
                  Pratinjau Terbatas (1 Halaman Utama)
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Tampilan di atas adalah sampel pratinjau halaman utama. Untuk membuka akses penuh, source code, atau demonstrasi live interaktif secara utuh, silakan hubungi pengembang.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => {
                    onClose();
                    if (onOpenContact) onOpenContact();
                  }}
                  variant="primary"
                  size="md"
                  icon={ShieldAlert}
                >
                  FULL ACCESS / CONTACT ME
                </Button>

                {project.link && (
                  <Button
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    variant="outline"
                    size="md"
                    icon={ExternalLink}
                  >
                    DEMO URL
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
