'use client';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import LiveChat from '@/components/pages/contact/components/LiveChat';
import ContactForm from '@/components/pages/contact/components/ContactForm';

/**
 * Global glass Contact modal. Any element can open it by dispatching
 * `window.dispatchEvent(new Event('open-contact'))` — no page navigation.
 */
export default function ContactModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-contact', handler);
    return () => window.removeEventListener('open-contact', handler);
  }, []);

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)} maxWidth="max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
        <div className="min-w-0 lg:pr-10 lg:max-h-[62vh]">
          <LiveChat />
        </div>
        <div className="min-w-0 lg:pl-10 lg:border-l lg:border-white/10 lg:max-h-[62vh]">
          <ContactForm />
        </div>
      </div>
    </Modal>
  );
}
