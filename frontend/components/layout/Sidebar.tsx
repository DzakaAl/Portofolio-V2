'use client';
import React, { useState } from 'react';
import { User, FolderGit2, Layers, ExternalLink, LogOut, Menu, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projectsCount: number;
  techStacksCount: number;
  onBackHome: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  projectsCount,
  techStacksCount,
  onBackHome,
  onLogout,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="font-lovelight text-sky-400 text-3xl font-semibold leading-none">
          DzakaAl
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-200 hover:text-white rounded-lg bg-white/5 border border-white/10"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-72 h-screen bg-black/95 lg:bg-black/80 border-r border-white/10 p-6 flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Admin Brand Logo Header */}
          <div className="flex items-center justify-between lg:justify-center pb-6 border-b border-white/10">
            <span className="font-lovelight text-sky-400 text-5xl font-semibold leading-none drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)]">
              DzakaAl
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Navigation Links */}
          <div className="space-y-2">
            <button
              onClick={() => handleTabClick('about')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
              }`}
            >
              <User className="w-4 h-4" /> About Me
            </button>

            <button
              onClick={() => handleTabClick('projects')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4" /> Projects
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeTab === 'projects' ? 'bg-black text-white' : 'bg-white/10 text-slate-300'}`}>
                {projectsCount}
              </span>
            </button>

            <button
              onClick={() => handleTabClick('techstack')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'techstack'
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" /> Tech Stacks
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeTab === 'techstack' ? 'bg-black text-white' : 'bg-white/10 text-slate-300'}`}>
                {techStacksCount}
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <button
            onClick={onBackHome}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white py-3 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
