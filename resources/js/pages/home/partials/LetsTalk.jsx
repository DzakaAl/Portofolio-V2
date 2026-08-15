import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mail, Send, LogOut, Sparkles } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Img from '../../../assets/portrait1.webp';
import { getMessages, sendMessage } from '../../../api';

export default function LetsTalk({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('livechat');
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('google_chat_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loadingMsg, setLoadingMsg] = useState(false);
  const chatEndRef = useRef(null);

  // Fetch messages from database via API
  useEffect(() => {
    if (isOpen && activeTab === 'livechat') {
      fetchChatMessages();
    }
  }, [isOpen, activeTab]);

  const fetchChatMessages = async () => {
    const data = await getMessages();
    setMessages(data);
  };

  // Auto scroll live chat to bottom
  useEffect(() => {
    if (activeTab === 'livechat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Google OAuth / Google Account Sign In
  const handleGoogleLogin = () => {
    const inputName = prompt('Masukkan Nama Anda untuk Chat:', '');
    const inputEmail = prompt('Masukkan Email Anda:', '');

    if (!inputName || !inputEmail) return;

    const loggedUser = {
      name: inputName,
      email: inputEmail,
      avatar: Img,
      id: Date.now().toString(),
    };
    setUser(loggedUser);
    localStorage.setItem('google_chat_user', JSON.stringify(loggedUser));
  };

  const handleGoogleLogout = () => {
    setUser(null);
    localStorage.removeItem('google_chat_user');
  };

  // Send Message in Live Chat to database
  const handleSendChatMessage = async (e) => {
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
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-white/20" />
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
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <img
                  src={msg.avatar || Img}
                  alt={msg.user}
                  className="w-8 h-8 rounded-full border border-white/10 shrink-0 mt-0.5 object-cover"
                />
                <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-200">{msg.user}</span>
                    <span className="text-[10px] font-mono text-white/40">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed select-text">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input or Google Login Prompt */}
          {user ? (
            <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ketik pesan publik..."
                className="flex-1 bg-black/60 border border-white/15 focus:border-white text-white px-4 py-3 rounded-2xl text-xs outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || loadingMsg}
                className="bg-white text-black p-3 rounded-2xl hover:bg-slate-200 disabled:opacity-40 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center space-y-3">
              <p className="text-xs text-slate-300">Masuk dengan Akun Google untuk bergabung dalam diskusi Live Chat.</p>
              <button
                onClick={handleGoogleLogin}
                className="inline-flex items-center justify-center gap-3 bg-white text-black font-bold text-xs px-6 py-3 rounded-2xl hover:bg-slate-200 transition-all cursor-pointer shadow-lg shadow-white/10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LET'S CONNECT (EMAIL FORM) */}
      {activeTab === 'connect' && (
        <form onSubmit={(e) => { e.preventDefault(); alert('Pesan berhasil terkirim!'); onClose(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              className="w-full bg-black/60 border border-white/10 focus:border-white text-white px-4 py-3 rounded-2xl text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Your Email
            </label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              className="w-full bg-black/60 border border-white/10 focus:border-white text-white px-4 py-3 rounded-2xl text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Message
            </label>
            <textarea
              rows={4}
              required
              placeholder="Ceritakan proyek atau ide Anda..."
              className="w-full bg-black/60 border border-white/10 focus:border-white text-white px-4 py-3 rounded-2xl text-xs outline-none"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" icon={Mail} className="w-full justify-center">
              SEND DIRECT MESSAGE
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
