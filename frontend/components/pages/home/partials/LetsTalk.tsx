'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mail, Send, LogOut, Sparkles } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { getMessages, sendMessage } from '@/lib/api';
import type { ChatMessage } from '@/lib/types';

const Img = '/assets/portrait1.webp';

const WHATSAPP_NUMBER = '6285181681725';

// ── WhatsApp inquiry categories: each type gets its own professional intro line ──
const INQUIRY_CATEGORIES = [
  {
    value: 'project',
    label: '💼 Project / Freelance',
    intro: 'I have a project in mind and would love to discuss how we can work together.',
  },
  {
    value: 'job',
    label: '🧑‍💼 Job Opportunity',
    intro: "I'm reaching out regarding a job opportunity that could be a great fit for both of us.",
  },
  {
    value: 'collaboration',
    label: '🤝 Collaboration',
    intro: "I'd love to explore a potential collaboration with you.",
  },
  {
    value: 'other',
    label: '💬 General / Other',
    intro: "I'd like to get in touch and connect with you.",
  },
] as const;

type InquiryCategory = (typeof INQUIRY_CATEGORIES)[number]['value'];

// Builds a clean, professional WhatsApp message from the "Let's Connect" form
function buildWhatsAppMessage(
  category: InquiryCategory,
  name: string,
  subject: string,
  message: string
): string {
  const categoryMeta = INQUIRY_CATEGORIES.find((c) => c.value === category) ?? INQUIRY_CATEGORIES[3];

  return [
    'Hi Dzaka! 👋',
    '',
    categoryMeta.intro,
    '',
    '────────────────────',
    `📌 *Subject:* ${subject}`,
    `👤 *From:* ${name}`,
    `🏷️ *Type:* ${categoryMeta.label}`,
    '────────────────────',
    '',
    message,
    '',
    '✉️ _Sent via the "Let\'s Connect" form on your portfolio website_',
  ].join('\n');
}

interface ChatUser {
  name: string;
  email: string;
  avatar: string;
  id: string;
}

interface GoogleJwtPayload {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

interface CustomUserData {
  name: string;
  email: string;
  avatar?: string;
}

type ChatTab = 'livechat' | 'connect';

export default function LetsTalk({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<ChatTab>('livechat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [user, setUser] = useState<ChatUser | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState<{ name: string; email: string; avatar?: string }>({
    name: '',
    email: '',
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Restore Google chat user session (client-side only)
  useEffect(() => {
    const saved = localStorage.getItem('google_chat_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('google_chat_user');
      }
    }
  }, []);

  // Fetch messages secepatnya saat komponen terpasang / ketika modal terbuka
  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (isOpen && activeTab === 'livechat') {
      fetchChatMessages();
    }
  }, [isOpen, activeTab]);

  const fetchChatMessages = async () => {
    const data = await getMessages();
    if (data && Array.isArray(data)) {
      setMessages(data);
    }
  };

  // Auto scroll live chat to bottom
  useEffect(() => {
    if (activeTab === 'livechat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Decode Google JWT Token (ID Token) payload
  const decodeJwtPayload = (token: string): GoogleJwtPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as GoogleJwtPayload;
    } catch (e) {
      console.error('Failed to decode JWT token:', e);
      return null;
    }
  };

  // Google OAuth Official Account Login Handler
  const handleGoogleLogin = (customData: CustomUserData | null = null) => {
    // Jika data dari modal manual dikirimkan (Fallback)
    if (customData && customData.name && customData.email) {
      const initialsAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(customData.name)}&background=2563EB&color=fff&bold=true`;
      const avatarUrl = customData.avatar?.trim() ? customData.avatar.trim() : initialsAvatar;

      const loggedUser: ChatUser = {
        name: customData.name,
        email: customData.email,
        avatar: avatarUrl,
        id: Date.now().toString(),
      };
      setUser(loggedUser);
      localStorage.setItem('google_chat_user', JSON.stringify(loggedUser));
      setShowLoginModal(false);
      setLoginForm({ name: '', email: '', avatar: '' });
      return;
    }

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Jika SDK Google OAuth siap dan Client ID ada di .env
    if (window.google?.accounts?.id && googleClientId) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (response.credential) {
            const payload = decodeJwtPayload(response.credential);
            if (payload && payload.email) {
              const googleUser: ChatUser = {
                name: payload.name || payload.email.split('@')[0],
                email: payload.email,
                avatar:
                  payload.picture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || payload.email)}`,
                id: payload.sub || Date.now().toString(),
              };
              setUser(googleUser);
              localStorage.setItem('google_chat_user', JSON.stringify(googleUser));
              setShowLoginModal(false);
            }
          }
        },
      });
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Buka modal login jika Google One Tap diblokir browser
          setShowLoginModal(true);
        }
      });
      return;
    }

    // Jika Client ID di hosting belum diisi atau GIS diblokir, buka modal profil
    setShowLoginModal(true);
  };

  const handleGoogleLogout = () => {
    setUser(null);
    localStorage.removeItem('google_chat_user');
  };

  // Send Message in Live Chat to database
  const handleSendChatMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim() || !user || loadingMsg) return;

    const payload = {
      user: user.name,
      email: user.email,
      avatar: user.avatar,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLoadingMsg(true);
    try {
      const res = await sendMessage(payload);
      if (res.data) {
        setMessages((prev) => [...prev, res.data]);
        setChatInput('');
      }
    } catch (err) {
      console.error('Gagal mengirim pesan chat:', err);
    } finally {
      setLoadingMsg(false);
    }
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
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-white/20 bg-zinc-800" />
                <div>
                  <p className="text-xs font-bold text-white leading-snug">{user.name}</p>
                  <p className="text-[10px] font-mono text-white/50">{user.email}</p>
                </div>
              </div>
              <Button variant="danger" size="sm" onClick={handleGoogleLogout} icon={LogOut}>
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
              const isOwner = msg.email?.toLowerCase() === 'dzakaal10@gmail.com';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isOwner ? 'flex-row-reverse text-right' : ''}`}
                >
                  <img
                    src={msg.avatar || Img}
                    alt={msg.user}
                    className="w-8 h-8 rounded-full border border-white/10 shrink-0 mt-0.5 object-cover bg-zinc-800"
                  />

                  <div
                    className={`flex-1 border rounded-2xl p-3 sm:p-3.5 transition-all ${
                      isOwner
                        ? 'bg-blue-500/10 border-blue-500/25 text-slate-100'
                        : 'bg-white/[0.03] border-white/10 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-xs font-body font-bold 'text-slate-200'}`}>
                        {msg.user}
                      </span>
                      <span className="text-[10px] font-mono text-white/40">
                        {msg.time}
                      </span>
                    </div>

                    <p className="text-xs font-tech text-slate-300 leading-relaxed text-left">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input or Google Login Prompt */}
          {user ? (
            <form onSubmit={handleSendChatMessage} className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ketik pesan publik..."
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-white/40 focus:bg-white/[0.06] text-white px-4 py-3 rounded-2xl text-xs outline-none transition-all duration-200 placeholder:text-white/30"
                />
              </div>
              <button
                type="submit"
                disabled={!chatInput.trim() || loadingMsg}
                className="bg-white text-black p-3.5 rounded-2xl hover:bg-slate-200 active:scale-95 disabled:opacity-30 disabled:hover:bg-white cursor-pointer transition-all duration-200 shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent border border-white/10 rounded-2xl p-5 text-center space-y-3.5 backdrop-blur-md">
              <div className="space-y-1">
                <p className="text-[11px] font-tech text-white/50">
                  Sign in dengan akun Google Anda untuk mulai mengirim pesan publik.
                </p>
              </div>

              <button
                onClick={() => handleGoogleLogin()}
                className="inline-flex items-center justify-center gap-3 bg-white text-black font-extrabold font-body text-xs px-6 py-3 rounded-xl hover:bg-slate-200 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)] group"
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29c-.8 1.6-1.29 3.39-1.29 5.42s.49 3.82 1.29 5.42l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>SIGN IN WITH GOOGLE</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LET'S CONNECT (DIRECT WHATSAPP) */}
      {activeTab === 'connect' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const categoryVal = e.target.category.value as InquiryCategory;
            const nameVal = e.target.senderName.value.trim();
            const subjectVal = e.target.subject.value.trim();
            const messageVal = e.target.message.value.trim();

            // Buka WhatsApp chat dengan template pesan profesional
            const waMessage = buildWhatsAppMessage(categoryVal, nameVal, subjectVal, messageVal);
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
            window.open(waUrl, '_blank');
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                name="senderName"
                required
                placeholder="Nama Anda..."
                className="w-full bg-black/60 border border-white/10 focus:border-white text-white px-4 py-3 rounded-2xl text-xs outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Inquiry Type
              </label>
              <select
                name="category"
                required
                defaultValue="project"
                className="w-full bg-black/60 border border-white/10 focus:border-white text-white px-4 py-3 rounded-2xl text-xs outline-none transition-all cursor-pointer appearance-none [&>option]:bg-zinc-900"
              >
                {INQUIRY_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              required
              placeholder="Diskusi Project / Tawaran Kolaborasi..."
              className="w-full bg-black/60 border border-white/10 focus:border-white text-white px-4 py-3 rounded-2xl text-xs outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Message
            </label>
            <textarea
              name="message"
              rows={5}
              required
              placeholder="Tuliskan pesan atau detail proyek Anda di sini..."
              className="w-full bg-black/60 border border-white/10 focus:border-white text-white px-4 py-3 rounded-2xl text-xs outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" icon={Send} className="w-full justify-center">
              SEND VIA WHATSAPP
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
