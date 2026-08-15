import React from 'react';
import { User, FolderGit2, Layers, ExternalLink, LogOut } from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  projectsCount,
  techStacksCount,
  onBackHome,
  onLogout,
}) {
  return (
    <aside className="w-72 bg-black/80 border-r border-white/10 p-6 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-50 backdrop-blur-2xl">
      <div className="space-y-8">
        {/* Admin Brand Logo Header */}
        <div className="flex items-center justify-center pb-6 border-b border-white/10">
          <span className="font-lovelight text-sky-400 text-5xl font-semibold leading-none drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)]">
            DzakaAl
          </span>
        </div>

        {/* Admin Navigation Links */}
        <div className="space-y-2">

          <button
            onClick={() => setActiveTab('about')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'about'
                ? 'bg-white text-black shadow-lg shadow-white/10 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
            }`}
          >
            <User className="w-4 h-4" /> About Me
          </button>

          <button
            onClick={() => setActiveTab('projects')}
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
            onClick={() => setActiveTab('techstack')}
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
  );
}
