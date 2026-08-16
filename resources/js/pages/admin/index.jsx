import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import AdminAboutSection from './partials/About';
import AdminProjectsSection from './partials/Projects';
import AdminTechStackSection from './partials/TechStack';
import { logoutAdmin } from '../../api';

export default function AdminPage({ onLogout, onBackHome }) {
  const [activeTab, setActiveTab] = useState('about');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [projectsCount, setProjectsCount] = useState(0);
  const [techStacksCount, setTechStacksCount] = useState(0);

  const handleShowMessage = (type, text) => {
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
    onLogout();
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-tech flex overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* FULL LEFT SIDEBAR FOR ADMIN PAGE */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectsCount={projectsCount}
        techStacksCount={techStacksCount}
        onBackHome={onBackHome}
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
          <AdminAboutSection onShowMessage={handleShowMessage} />
        )}

        {/* SECTION 2: PROJECTS */}
        {activeTab === 'projects' && (
          <AdminProjectsSection
            onShowMessage={handleShowMessage}
            onProjectsCountChange={setProjectsCount}
          />
        )}

        {/* SECTION 3: TECH STACKS */}
        {activeTab === 'techstack' && (
          <AdminTechStackSection
            onShowMessage={handleShowMessage}
            onTechStacksCountChange={setTechStacksCount}
          />
        )}
      </main>
    </div>
  );
}
