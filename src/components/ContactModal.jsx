import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Fullstack Development',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-white/15 p-8 shadow-2xl bg-[#0a0a0a] overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full glass-panel text-slate-400 hover:text-white border border-white/10 hover:border-white/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-white">TRANSMISSION RECEIVED!</h3>
            <p className="text-slate-300 text-sm">
              Thank you for reaching out. I will respond to your message within 24 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-white/70 font-mono text-xs uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LET'S CONNECT</span>
              </div>
              <h3 className="text-3xl font-black font-heading text-white tracking-wide">
                START A PROJECT
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Fill in the details below to initiate digital collaboration.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">YOUR NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="alex@nexus.io"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">SERVICE TYPE</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-white transition-all"
                >
                  <option value="Fullstack Development">Fullstack & Web3 App</option>
                  <option value="3D & WebGL Graphics">3D Motion & WebGL</option>
                  <option value="Brand & UI System">Brand System & UI/UX</option>
                  <option value="Game UI / HUD">Game UI / Cyberpunk Systems</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">PROJECT DETAILS</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe project scope, timeline, and goals..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm tracking-widest uppercase shadow-lg shadow-white/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>SEND TRANSMISSION</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
