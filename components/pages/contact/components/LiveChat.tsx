'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, LogOut } from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionHeading from './SectionHeading';
import { useLanguage } from '@/lib/i18n';
import { getMessages, sendMessage } from '@/lib/api';
import type { ChatMessage } from '@/lib/types';

const Img = '/assets/portrait1.webp';

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

export default function LiveChat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [user, setUser] = useState<ChatUser | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [googleUnavailable, setGoogleUnavailable] = useState(false);

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

  // Fetch messages saat komponen terpasang
  useEffect(() => {
    fetchChatMessages();
  }, []);

  const fetchChatMessages = async () => {
    const data = await getMessages();
    if (data && Array.isArray(data)) {
      setMessages(data);
    }
  };

  // Auto scroll live chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  // Simpan user dari ID token Google (dipanggil oleh tombol resmi Google).
  const handleCredential = (credential?: string) => {
    if (!credential) return;
    const payload = decodeJwtPayload(credential);
    if (!payload?.email) return;
    const googleUser: ChatUser = {
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      avatar: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || payload.email)}`,
      id: payload.sub || Date.now().toString(),
    };
    setUser(googleUser);
    localStorage.setItem('google_chat_user', JSON.stringify(googleUser));
  };

  // Tampilkan tombol resmi "Sign in with Google". Berbeda dengan One Tap (prompt()),
  // tombol ini selalu membuka popup pilih akun saat diklik dan tidak bisa "dilewati" Google.
  useEffect(() => {
    if (user) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) { setGoogleUnavailable(true); return; }
    let tries = 0;
    const timer = setInterval(() => {
      const gid = window.google?.accounts?.id;
      if (gid && googleButtonRef.current) {
        clearInterval(timer);
        gid.initialize({ client_id: clientId, callback: (res) => handleCredential(res.credential) });
        googleButtonRef.current.innerHTML = '';
        gid.renderButton(googleButtonRef.current, { theme: 'filled_black', size: 'large', shape: 'pill', text: 'signin_with', locale: 'id' });
      } else if (++tries > 50) {
        clearInterval(timer); // SDK Google gagal dimuat (diblokir ekstensi/jaringan)
        setGoogleUnavailable(true);
      }
    }, 200);
    return () => clearInterval(timer);
  }, [user]);

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
    <section className="flex flex-col min-w-0 h-full">
      {/* Section Heading */}
      <SectionHeading title={t('letsTalk.liveChat')} />

      {/* User Account Info if logged in */}
      {user && (
        <div className="flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl p-3 mb-3">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-white/20 bg-zinc-800" />
            <div>
              <p className="text-xs font-bold text-white leading-snug">{user.name}</p>
              <p className="text-[10px] font-mono text-white/50">{user.email}</p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={handleGoogleLogout} icon={LogOut}>
            {t('liveChat.logout')}
          </Button>
        </div>
      )}

      {/* Live Chat Message Stream */}
      <div className="flex-1 min-h-[8rem] overflow-y-auto space-y-3 pr-2 overscroll-contain touch-auto select-text border border-white/10 rounded-2xl p-3 bg-black/40">
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
                    ? 'bg-white/[0.08] border-white/30 text-white'
                    : 'bg-white/[0.03] border-white/10 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-body font-bold text-slate-200">
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
        <form onSubmit={handleSendChatMessage} className="flex items-center gap-2 pt-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t('liveChat.placeholder')}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-white/40 focus:bg-white/[0.06] text-white px-3.5 py-2.5 rounded-xl text-xs outline-none transition-all duration-200 placeholder:text-white/30"
            />
          </div>
          <button
            type="submit"
            disabled={!chatInput.trim() || loadingMsg}
            className="bg-white text-black p-3 rounded-xl hover:bg-slate-200 active:scale-95 disabled:opacity-30 disabled:hover:bg-white cursor-pointer transition-all duration-200 shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="overflow-hidden glass-panel rounded-2xl p-4 mt-3 text-center space-y-3 ">
          <p className="text-[11px] font-tech text-white/50">
            {t('liveChat.signInPrompt')}
          </p>

          <div className="flex justify-center min-h-[44px]" ref={googleButtonRef} />
          {googleUnavailable && (
            <p className="text-[11px] font-tech text-white/40">Login Google sedang tidak tersedia. Muat ulang halaman atau nonaktifkan pemblokir iklan.</p>
          )}
        </div>
      )}
    </section>
  );
}
