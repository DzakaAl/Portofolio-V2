import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import DriftWall from '../../components/ui/DriftWall';
import Navbar from '../../components/layout/Navbar';
import LetsTalkModal from '../home/partials/LetsTalk';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { getProjects } from '../../api';

function useWallConfig() {
  const getConfig = useCallback(() => {
    if (typeof window === 'undefined') return { columns: 6, tileWidth: 280, tileHeight: 190 };
    const w = window.innerWidth;
    if (w < 640) return { columns: 3, tileWidth: 160, tileHeight: 110 };
    if (w < 1024) return { columns: 4, tileWidth: 220, tileHeight: 150 };
    if (w < 1440) return { columns: 5, tileWidth: 260, tileHeight: 175 };
    return { columns: 6, tileWidth: 290, tileHeight: 195 };
  }, []);

  const [config, setConfig] = useState(getConfig);

  useEffect(() => {
    const onResize = () => setConfig(getConfig());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [getConfig]);

  return config;
}

export default function LabPage({ onBack }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { columns, tileWidth, tileHeight } = useWallConfig();

  useEffect(() => {
    window.scrollTo(0, 0);
    let mounted = true;
    getProjects().then((data) => {
      if (mounted) setProjects(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative min-h-dvh h-screen w-screen bg-[#060010] text-white overflow-hidden select-none">
      {/* Header Navbar */}
      <Navbar
        onOpenContact={() => setIsContactOpen(true)}
        onNavigateHome={onBack}
      />

      {/* Pure Full-Screen DriftWall */}
      <div className="absolute inset-0 z-0">
        {projects.length > 0 && (
          <DriftWall
            items={projects}
            columns={columns}
            tileWidth={tileWidth}
            tileHeight={tileHeight}
            gap={18}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={42}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={64}
            fade={0.6}
            dim={0.55}
            overlayColor="transparent"
            radius={14}
            roll={0}
            pauseOnHover={false}
            grayscale={false}
            onItemClick={(project) => setSelectedProject(project)}
          />
        )}
      </div>

      {/* Modal Penjelasan Project Lab */}
      <Modal
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        maxWidth="max-w-2xl"
        className="p-0 sm:p-0"
      >
        {selectedProject && (
          <div>
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black font-tech text-white tracking-tight leading-tight">
                  {selectedProject.title}
                </h3>
              </div>

              <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
                {selectedProject.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedProject.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/60 text-xs font-mono tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-4 flex-wrap">
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                  Project · The Lab
                </span>
                <Button
                  href={selectedProject.link}
                  target="_blank"
                  rel="noreferrer"
                  variant="primary"
                  size="md"
                  icon={ExternalLink}
                >
                  Preview
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <LetsTalkModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}