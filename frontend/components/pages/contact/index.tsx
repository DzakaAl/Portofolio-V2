'use client';
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import LiveChat from './components/LiveChat';
import ContactForm from './components/ContactForm';

export default function ContactView() {
  return (
    <div className="relative min-h-dvh w-full bg-black text-white select-none lg:h-dvh lg:overflow-hidden">

      {/* Header Navbar */}
      <Navbar />

      {/* Full-page content: mobile scrollable, desktop fixed dengan kolom 70vh */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-36 lg:pt-50 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
          <div className="min-w-0 lg:pr-14 lg:h-[60vh]">
            <LiveChat />
          </div>
          <div className="min-w-0 lg:pl-14 lg:border-l lg:border-white/10 lg:h-[60vh]">
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
}


