'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import LiveWallpaper from '@/components/ui/LiveWallpaper';
import CloudVideoHover from '@/components/ui/CloudVideoHover';
import { loginAdmin } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mouse hover tracking state for CloudVideoHover
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginAdmin(email, password);
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        router.push('/admin');
      }
    } catch (err) {
      setError((err as Error).message || 'Login gagal. Silakan periksa email & password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="min-h-screen bg-black text-slate-100 font-tech flex flex-col justify-center items-center px-4 relative overflow-hidden"
    >
      {/* 1. Live Wallpaper Shader Canvas Background */}
      <LiveWallpaper />

      {/* 2. Cloud Video Hover Canvas Mask Effect */}
      <CloudVideoHover isHovered={isHovered} mousePos={mousePos} />

      {/* Ambient Light Overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-0" />

      {/* Login Glassmorphism Card (Crystal Clear Glass) */}
      <div className="w-full max-w-md bg-white/[0.03] border border-white/30 backdrop-blur-md p-8 lg:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-20 relative">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold font-tech tracking-wide text-white drop-shadow">Sign In</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/50 text-red-100 rounded-2xl text-xs flex items-start gap-3 backdrop-blur-md">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email admin..."
                className="w-full bg-white/[0.06] border border-white/25 focus:border-white text-white pl-11 pr-4 py-3.5 rounded-2xl outline-none text-xs backdrop-blur-md transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin..."
                className="w-full bg-white/[0.06] border border-white/25 focus:border-white text-white pl-11 pr-4 py-3.5 rounded-2xl outline-none text-xs backdrop-blur-md transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-slate-200 font-bold py-4 rounded-2xl transition-all duration-200 text-xs uppercase tracking-wider mt-4 disabled:opacity-50 cursor-pointer shadow-lg shadow-white/20 flex justify-center items-center"
          >
            {loading ? 'Authenticating...' : 'LogIn'}
          </button>
        </form>
      </div>
    </div>
  );
}
