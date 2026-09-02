'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import About from './components/About';
import Projects from './components/Projects';
import TechStack from './components/TechStack';
import Translations from './components/Translations';
import { logoutAdmin, getAdminUser } from '@/lib/api';

type AdminTab = 'about' | 'projects' | 'techstack' | 'translations';

interface StatusMessage {
  type: '' | 'success' | 'error';
  text: string;
}

type ShowMessageFn = (type: 'success' | 'error', text: string) => void;

export default function AdminPage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('about');
  const [message, setMessage] = useState<StatusMessage>({ type: '', text: '' });
  const [projectsCount, setProjectsCount] = useState(0);
  const [techStacksCount, setTechStacksCount] = useState(0);
  const [pendingTranslationsCount, setPendingTranslationsCount] = useState(0);

  // Auth guard: token must exist AND be valid (verified against the API).
  // Tanpa verifikasi ini, siapa pun bisa menempelkan token sembarang di
  // localStorage untuk membuka halaman admin.
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/login');
      return;
    }
    let mounted = true;
    getAdminUser().then((user) => {
      if (!mounted) return;
      if (!user) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.replace('/login');
        return;
      }
      setIsAuthed(true);
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleShowMessage: ShowMessageFn = (type, text) => {
    setMessage({ type, text });
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (err) {
      // ignore
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/login');
  };

  const handleBackHome = () => {
    router.push('/');
  };

  // Jangan render workspace sampai token terverifikasi agar tidak berkedip
  if (!isAuthed) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 font-tech flex overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* FULL LEFT SIDEBAR FOR ADMIN PAGE */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as AdminTab)}
        projectsCount={projectsCount}
        techStacksCount={techStacksCount}
        pendingTranslationsCount={pendingTranslationsCount}
        onBackHome={handleBackHome}
        onLogout={handleLogout}
      />

      {/* RIGHT MAIN WORKSPACE CONTENT */}
      <main className="flex-1 overflow-y-auto h-screen p-4 sm:p-6 lg:p-12 pt-20 lg:pt-12 relative z-10 space-y-6 sm:space-y-8">
        
        {/* Alert Notification */}
        {message.text && (
          <div
            className={`p-5 rounded-2xl text-sm flex items-center gap-3 shadow-xl backdrop-blur-xl border ${
              message.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/60 border-red-500/40 text-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* SECTION 1: ABOUT ME */}
        {activeTab === 'about' && (
          <About onShowMessage={handleShowMessage} />
        )}

        {/* SECTION 2: PROJECTS */}
        {activeTab === 'projects' && (
          <Projects
            onShowMessage={handleShowMessage}
            onProjectsCountChange={setProjectsCount}
          />
        )}

        {/* SECTION 3: TECH STACKS */}
        {activeTab === 'techstack' && (
          <TechStack
            onShowMessage={handleShowMessage}
            onTechStacksCountChange={setTechStacksCount}
          />
        )}

        {/* SECTION 4: TRANSLATIONS (EN -> ID dictionary for DB content) */}
        {activeTab === 'translations' && (
          <Translations
            onShowMessage={handleShowMessage}
            onPendingCountChange={setPendingTranslationsCount}
          />
        )}
      </main>
    </div>
  );
}
