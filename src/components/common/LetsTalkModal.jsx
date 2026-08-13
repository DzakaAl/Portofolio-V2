import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mail, Send, LogOut, ExternalLink, Sparkles, User, Globe } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Card from '../ui/Card';

// Initial sample messages for the live chat
const INITIAL_CHAT_MESSAGES = [
  {
    id: 1,
    user: 'Alex Mercer',
    email: 'alex@dev.io',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
    text: 'Impressed by the smooth 3D spatial animations and micro-interactions! 🔥',
    time: '19:40',
  },
  {
    id: 2,
    user: 'Aria Chen',
    email: 'aria.chen@design.co',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    text: 'What matrix transformation logic is driving the Lab DriftWall component?',
    time: '19:48',
  },
  {
    id: 3,
    user: 'DzakaAl',
    email: 'dzakaal10@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
    text: 'Hey Aria! The DriftWall utilizes dual-axis CSS perspective displacement synced with requestAnimationFrame. Glad you liked it!',
    time: '19:55',
  },
];

export default function LetsTalkModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('livechat'); // 'livechat' | 'connect'
  
  // Live Chat state
  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [user, setUser] = useState(null); // Google User object when logged in
  const chatEndRef = useRef(null);

  // Auto scroll live chat to bottom
  useEffect(() => {
    if (activeTab === 'livechat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Google Login Simulation
  const handleGoogleLogin = () => {
    setUser({
      name: 'DzakaAl',
      email: 'dzakaal10@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
      id: Date.now().toString(),
    });
  };

  const handleGoogleLogout = () => {
    setUser(null);
  };

  // Send Message in Live Chat
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !user) return;

    const newMsg = {
      id: Date.now(),
      user: user.name,
      email: user.email,
      avatar: user.avatar,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      {/* Navigation Header Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('livechat')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'livechat'
                ? 'bg-white text-black font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>LIVE CHAT</span>
          </button>

          <button
            onClick={() => setActiveTab('connect')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'connect'
                ? 'bg-white text-black font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>LET'S CONNECT</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE CHAT */}
      {activeTab === 'livechat' && (
        <div className="space-y-4">
          
          {/* User Account Info Top Header if logged in */}
          {user && (
            <div className="flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl p-3.5">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-white/20" />
                <div>
                  <p className="text-xs font-bold text-white leading-snug">{user.name}</p>
                  <p className="text-[10px] font-mono text-white/50">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleGoogleLogout} icon={LogOut}>
                Logout
              </Button>
            </div>
          )}

          {/* Live Chat Message Stream */}
          <div
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="h-72 sm:h-80 overflow-y-auto space-y-4 pr-2 overscroll-contain touch-auto select-text border border-white/5 rounded-2xl p-3 bg-black/40"
          >
            {messages.map((msg) => {
              const isDzaka = msg.email === 'dzakaal10@gmail.com';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 items-end ${isDzaka ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.user}
                    className="w-8 h-8 rounded-full border border-white/15 shrink-0 mb-1"
                  />
                  <div
                    className={`p-3.5 rounded-2xl max-w-[80%] space-y-1.5 ${
                      isDzaka
                        ? 'bg-white text-black rounded-br-none shadow-[0_4px_20px_rgba(255,255,255,0.15)]'
                        : 'bg-white/[0.05] border border-white/10 text-white rounded-bl-none'
                    }`}
                  >
                    <div className={`flex items-center justify-between gap-4 text-[10px] font-mono ${isDzaka ? 'text-black/60' : 'text-white/40'}`}>
                      <span className={`font-bold ${isDzaka ? 'text-black font-tech text-xs' : 'text-white/90 text-xs'}`}>
                        {msg.user}
                      </span>
                      <span>{msg.time}</span>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDzaka ? 'font-medium text-black' : 'font-light text-slate-200'}`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Field / Google Login Button at bottom */}
          {user ? (
            <form onSubmit={handleSendChatMessage} className="flex items-center gap-2.5 pt-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-3.5 rounded-full bg-slate-900/90 border border-white/15 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-white transition-all"
              />
              <Button type="submit" variant="primary" size="md" icon={Send}>
                Send
              </Button>
            </form>
          ) : (
            <div className="pt-2">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-full bg-white text-black font-extrabold text-xs tracking-[0.12em] uppercase shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google to Chat</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LET'S CONNECT */}
      {activeTab === 'connect' && (
        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black font-tech text-white tracking-wide uppercase">
              LET'S CONNECT
            </h3>
          </div>

          <div className=" border-t border-b border-white/10 py-2">
            {/* Email Row */}
            <a
              href="mailto:dzakaal10@gmail.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between py-4 px-2 hover:bg-white/[0.04] transition-all rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">DIRECT EMAIL</p>
                  <p className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    dzakaal10@gmail.com
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </a>

            {/* Instagram Row */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between py-4 px-2 hover:bg-white/[0.04] transition-all rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">INSTAGRAM</p>
                  <p className="text-sm sm:text-base font-bold text-white group-hover:text-pink-400 transition-colors">
                    @dzakaal
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </a>

            {/* LinkedIn Row */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between py-4 px-2 hover:bg-white/[0.04] transition-all rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">LINKEDIN</p>
                  <p className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    linkedin.com/in/dzakaal
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </a>

            {/* GitHub Row */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between py-4 px-2 hover:bg-white/[0.04] transition-all rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">GITHUB</p>
                  <p className="text-sm sm:text-base font-bold text-white group-hover:text-slate-300 transition-colors">
                    github.com/dzakaal
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
